import {
  array,
  bool,
  custom,
  instance,
  number,
  object,
  shape,
  string,
  tuple,
  union,
  UnionPredicate,
} from '../../src';
import { runChecks, runInProd } from '../helpers';

describe('UnionPredicate', () => {
  let predicate: UnionPredicate;

  class Foo {}
  class Bar {}

  beforeEach(() => {
    predicate = union(
      [
        array(string()),
        bool(true).only(),
        instance(Foo),
        number().between(0, 5),
        object(number()),
        string('foo').oneOf(['foo', 'bar', 'baz']),
      ],
      'baz',
    );
  });

  it('errors if a non-array is not passed', () => {
    expect(() => {
      // @ts-expect-error
      union('foo', []);
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if an empty array is passed', () => {
    expect(() => {
      union([], []);
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if an array with non-predicates is passed', () => {
    expect(() => {
      // @ts-expect-error
      union([123], []);
    }).toThrowErrorMatchingSnapshot();
  });

  it('doesnt error if a predicate array is passed', () => {
    expect(() => {
      union([string()], []);
    }).not.toThrow();
  });

  it('sets default value', () => {
    expect(union([string()], 'bar').defaultValue).toBe('bar');
  });

  describe('default()', () => {
    it('returns the default value', () => {
      expect(predicate.default()).toBe('baz');
    });
  });

  describe('run()', () => {
    it('errors if a unsupported type is used', () => {
      expect(() => {
        runChecks(union([string(), number(), bool()], []), []);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if a nested union is used', () => {
      expect(() => {
        runChecks(
          union<string[]>(
            [string('foo').oneOf(['foo', 'bar', 'baz']), union([number(), bool()], [])],
            [],
          ),
          [],
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors with the class name for instance checks', () => {
      expect(() => {
        runChecks(union([number(), instance(Buffer)], {}), {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns default value if value is undefined', () => {
      predicate.defaultValue = 1;

      expect(runChecks(predicate)).toEqual(1);
    });

    it('returns default value from factory if value is undefined', () => {
      // @ts-expect-error
      predicate.defaultValueFactory = () => 'foo';

      expect(runChecks(predicate)).toEqual('foo');
    });

    it('runs array check', () => {
      expect(() => {
        runChecks(predicate, [123]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs boolean check', () => {
      expect(() => {
        runChecks(predicate, false);
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs custom check', () => {
      expect(() => {
        runChecks(
          union(
            [
              string(),
              custom((value) => {
                if (typeof value === 'number') {
                  throw new TypeError('Encountered a number!');
                }
              }, ''),
            ],
            0,
          ),
          123,
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs instance check', () => {
      expect(() => {
        runChecks(predicate, new Bar());
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs number check', () => {
      expect(() => {
        runChecks(predicate, 10);
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs object check', () => {
      expect(() => {
        runChecks(predicate, { foo: 'foo' });
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs shape check', () => {
      expect(() => {
        runChecks(
          union(
            [
              shape({
                foo: string(),
                bar: number(),
              }),
            ],
            {},
          ),
          { foo: 123 },
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs string check', () => {
      expect(() => {
        runChecks(predicate, 'qux');
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs tuple check', () => {
      expect(() => {
        runChecks(
          union(
            [tuple<['foo', 'bar', 'baz']>([string(), string(), string()])],
            '',
          ),
          '',
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs correctly for valid values', () => {
      expect(runChecks(predicate, 'foo')).toBe('foo');
      expect(runChecks(predicate, 3)).toBe(3);
      expect(runChecks(predicate, true)).toBe(true);
    });

    it('supports multiple array predicates', () => {
      predicate = union([array(string()), array(number())], []);

      expect(() => {
        runChecks(predicate, [true]);
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        runChecks(predicate, [123]);
      }).not.toThrow();

      expect(() => {
        runChecks(predicate, ['abc']);
      }).not.toThrow();
    });

    it('supports multiple object predicates', () => {
      predicate = union([object(string()), object(number())], {});

      expect(() => {
        runChecks(predicate, { foo: true });
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        runChecks(predicate, { foo: 123 });
      }).not.toThrow();

      expect(() => {
        runChecks(predicate, { foo: 'abc' });
      }).not.toThrow();
    });

    it('supports object and shape predicates in parallel', () => {
      predicate = union(
        [
          shape({
            foo: string(),
            bar: number(),
            baz: bool(),
          }).exact(),
          object(string()),
        ],
        {},
      );

      expect(() => {
        runChecks(predicate, { unknown: true });
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        runChecks(predicate, { foo: 123 });
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        runChecks(predicate, { foo: 'abc', bar: 'abc', baz: 123 });
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        runChecks(predicate, { foo: 'abc', bar: 123 });
      }).not.toThrow();

      expect(() => {
        runChecks(predicate, { key: 'value' });
      }).not.toThrow();
    });

    it('returns shapes as their full objects', () => {
      predicate = union(
        [
          shape({
            foo: string().required(),
            bar: number(),
            baz: bool(),
          }).exact(),
          object(number()),
        ],
        {},
      );

      expect(runChecks(predicate, {})).toEqual({});
      expect(runChecks(predicate, { foo: 'foo' })).toEqual({
        foo: 'foo',
        bar: 0,
        baz: false,
      });
      expect(runChecks(predicate, { a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
    });

    it('returns an array of shapes as their full objects', () => {
      predicate = union(
        [
          array(
            shape({
              foo: string(),
              bar: number(),
              baz: bool(),
            }).exact(),
          ),
        ],
        [],
      );

      expect(runChecks(predicate, [])).toEqual([]);
      expect(runChecks(predicate, [{ foo: 'foo' }, { bar: 123 }, { baz: true }])).toEqual([
        {
          foo: 'foo',
          bar: 0,
          baz: false,
        },
        {
          foo: '',
          bar: 123,
          baz: false,
        },
        {
          foo: '',
          bar: 0,
          baz: true,
        },
      ]);
    });

    describe('production', () => {
      it(
        'returns default value if value is undefined',
        runInProd(() => {
          expect(runChecks(predicate)).toBe('baz');
        }),
      );

      it(
        'bypasses checks and returns value',
        runInProd(() => {
          expect(
            runChecks(
              predicate,
              // @ts-expect-error Test invalid type
              'qux',
            ),
          ).toBe('qux');
        }),
      );
    });
  });

  describe('typeAlias()', () => {
    it('returns all the available type aliases separated by pipes', () => {
      expect(union([string(), number(), bool()], []).typeAlias()).toBe('string | number | boolean');
    });

    it('supports complex structures', () => {
      expect(predicate.typeAlias()).toBe(
        'array<string> | boolean | Foo | number | object<number> | string',
      );
    });
  });
});
