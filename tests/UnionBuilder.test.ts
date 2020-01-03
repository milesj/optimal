import UnionBuilder, { union } from '../src/UnionBuilder';
import { custom } from '../src/Builder';
import { array } from '../src/ArrayBuilder';
import { bool } from '../src/BooleanBuilder';
import { object } from '../src/ObjectBuilder';
import { instance } from '../src/InstanceBuilder';
import { number } from '../src/NumberBuilder';
import { shape } from '../src/ShapeBuilder';
import { string } from '../src/StringBuilder';
import { runChecks, runInProd } from './helpers';

describe('UnionBuilder', () => {
  let builder: UnionBuilder;

  class Foo {}
  class Bar {}

  beforeEach(() => {
    builder = union(
      [
        array(string()),
        bool(true).only(),
        instance(Foo),
        number().between(0, 5),
        object(number()),
        string('foo').oneOf(['foo', 'bar', 'baz']),
      ],
      '',
    );
  });

  it('errors if a non-array is not passed', () => {
    expect(() => {
      // @ts-ignore
      union('foo', []);
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if an empty array is passed', () => {
    expect(() => {
      union([], []);
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if an array with non-builders is passed', () => {
    expect(() => {
      // @ts-ignore
      union([123], []);
    }).toThrowErrorMatchingSnapshot();
  });

  it('doesnt error if a builder array is passed', () => {
    expect(() => {
      union([string()], []);
    }).not.toThrow();
  });

  it('sets default value', () => {
    expect(union([string()], 'bar').defaultValue).toBe('bar');
  });

  describe('runChecks()', () => {
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
      builder.defaultValue = 1;

      expect(runChecks(builder)).toEqual(1);
    });

    it('returns default value from factory if value is undefined', () => {
      // @ts-ignore
      builder.defaultValueFactory = () => 'foo';

      expect(runChecks(builder)).toEqual('foo');
    });

    it('runs array check', () => {
      expect(() => {
        runChecks(builder, [123]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs boolean check', () => {
      expect(() => {
        runChecks(builder, false);
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs custom check', () => {
      expect(() => {
        runChecks(
          union(
            [
              string(),
              custom(value => {
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
        runChecks(builder, new Bar());
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs number check', () => {
      expect(() => {
        runChecks(builder, 10);
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs object check', () => {
      expect(() => {
        runChecks(builder, { foo: 'foo' });
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
        runChecks(builder, 'qux');
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs correctly for valid values', () => {
      expect(runChecks(builder, 'foo')).toBe('foo');
      expect(runChecks(builder, 3)).toBe(3);
      expect(runChecks(builder, true)).toBe(true);
    });

    it('supports multiple array builders', () => {
      builder = union([array(string()), array(number())], []);

      expect(() => {
        runChecks(builder, [true]);
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        runChecks(builder, [123]);
      }).not.toThrow();

      expect(() => {
        runChecks(builder, ['abc']);
      }).not.toThrow();
    });

    it('supports multiple object builders', () => {
      builder = union([object(string()), object(number())], {});

      expect(() => {
        runChecks(builder, { foo: true });
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        runChecks(builder, { foo: 123 });
      }).not.toThrow();

      expect(() => {
        runChecks(builder, { foo: 'abc' });
      }).not.toThrow();
    });

    it('supports object and shape builders in parallel', () => {
      builder = union(
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
        runChecks(builder, { unknown: true });
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        runChecks(builder, { foo: 123 });
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        runChecks(builder, { foo: 'abc', bar: 'abc', baz: 123 });
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        runChecks(builder, { foo: 'abc', bar: 123 });
      }).not.toThrow();

      expect(() => {
        runChecks(builder, { key: 'value' });
      }).not.toThrow();
    });

    it('returns shapes as their full objects', () => {
      builder = union(
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

      expect(runChecks(builder, {})).toEqual({});
      expect(runChecks(builder, { foo: 'foo' })).toEqual({
        foo: 'foo',
        bar: 0,
        baz: false,
      });
      expect(runChecks(builder, { a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
    });

    it('returns an array of shapes as their full objects', () => {
      builder = union(
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

      expect(runChecks(builder, [])).toEqual([]);
      expect(runChecks(builder, [{ foo: 'foo' }, { bar: 123 }, { baz: true }])).toEqual([
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
          expect(runChecks(builder)).toBe('');
        }),
      );

      it(
        'bypasses checks and returns value',
        runInProd(() => {
          expect(
            runChecks(
              builder,
              // @ts-ignore Test invalid type
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
      expect(builder.typeAlias()).toBe(
        'array<string> | boolean | Foo | number | object<number> | string',
      );
    });
  });
});
