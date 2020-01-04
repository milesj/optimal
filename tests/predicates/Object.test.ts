import { object, blueprint, string, number, ObjectPredicate } from '../../src';
import { runChecks, runInProd } from '../helpers';

describe('ObjectPredicate', () => {
  let predicate: ObjectPredicate<string>;

  beforeEach(() => {
    predicate = object(string(), {});
  });

  it('errors if a non-predicate is passed', () => {
    expect(() => {
      // @ts-ignore Allow non-predicate
      predicate = object(123);
    }).toThrowErrorMatchingSnapshot();
  });

  it('doesnt error if a predicate is not passed', () => {
    expect(() => {
      object();
    }).not.toThrow();
  });

  it('doesnt error if a predicate is passed', () => {
    expect(() => {
      predicate = object(string());
    }).not.toThrow();
  });

  it('sets type and default value', () => {
    predicate = object(string(), { foo: 'bar' });

    expect(predicate.type).toBe('object');
    expect(predicate.defaultValue).toEqual({ foo: 'bar' });
  });

  describe('run()', () => {
    it('returns an empty object for no data', () => {
      expect(runChecks(predicate)).toEqual({});
    });

    it('errors if a non-object is passed', () => {
      expect(() => {
        runChecks(
          predicate,
          // @ts-ignore Test invalid type
          'foo',
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if a non-object is passed, when not using a predicate', () => {
      expect(() => {
        runChecks(
          object(),
          // @ts-ignore Test invalid type
          'foo',
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns default value if value is undefined', () => {
      expect(runChecks(object(string(), { foo: 'foo' }))).toEqual({ foo: 'foo' });
    });

    it('returns default value from factory if value is undefined', () => {
      expect(
        runChecks(
          object(string(), () => ({ foo: 'bar' })),
          undefined,
          {
            struct: { multiplier: 3 },
          },
        ),
      ).toEqual({ foo: 'bar' });
    });

    it('checks each item in the object', () => {
      expect(() => {
        runChecks(
          predicate,
          // @ts-ignore Test invalid type
          {
            a: 'foo',
            b: 'bar',
            c: 123,
          },
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if an object item is invalid; persists path with index', () => {
      expect(() => {
        runChecks(
          predicate,
          // @ts-ignore Test invalid type
          {
            foo: 123,
          },
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('supports objects of objects', () => {
      const nestedPredicate = object(object(string()));

      const data = {
        a: {
          foo: '123',
          bar: '456',
        },
        b: {
          baz: '789',
        },
      };

      expect(runChecks(nestedPredicate, data)).toEqual(data);
    });

    it('errors correctly for objects in objects', () => {
      const nestedPredicate = object(object(string()));

      expect(() => {
        runChecks(
          nestedPredicate,
          // @ts-ignore Test invalid type
          {
            a: {
              foo: '123',
              bar: 456,
            },
            b: {
              baz: '789',
            },
          },
        );
      }).toThrowErrorMatchingSnapshot();
    });

    describe('production', () => {
      it(
        'returns an empty object if value is object',
        runInProd(() => {
          expect(runChecks(predicate, {})).toEqual({});
        }),
      );

      it(
        'returns default value if value is undefined',
        runInProd(() => {
          const def = { foo: 'foo' };
          predicate.defaultValue = def;

          expect(runChecks(predicate)).toEqual(def);
        }),
      );

      it(
        'returns default value from factory if value is undefined',
        runInProd(() => {
          expect(runChecks(object(string(), () => ({ foo: 'foo' })))).toEqual({ foo: 'foo' });
        }),
      );

      it(
        'bypasses checks and returns value',
        runInProd(() => {
          expect(
            runChecks(
              predicate,
              // @ts-ignore Test invalid type
              { foo: 123 },
            ),
          ).toEqual({ foo: '123' });
        }),
      );
    });
  });

  describe('notEmpty()', () => {
    beforeEach(() => {
      predicate.notEmpty();
    });

    it('errors if value is empty', () => {
      expect(() => {
        runChecks(predicate, {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if not empty', () => {
      expect(() => {
        runChecks(predicate, { foo: '123' });
      }).not.toThrow();
    });
  });

  describe('sizeOf()', () => {
    beforeEach(() => {
      predicate.sizeOf(3);
    });

    it('errors if length doesnt match', () => {
      expect(() => {
        runChecks(predicate, {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if length matches', () => {
      expect(() => {
        runChecks(predicate, { a: '1', b: '2', c: '3' });
      }).not.toThrow();
    });
  });

  describe('typeAlias()', () => {
    it('returns the type name when no contents', () => {
      expect(object().typeAlias()).toBe('object');
    });

    it('returns the type name with contents type', () => {
      expect(object(number()).typeAlias()).toBe('object<number>');
    });
  });
});

describe('blueprint()', () => {
  it('returns a predicate for Date', () => {
    expect(blueprint()).toBeInstanceOf(ObjectPredicate);
  });

  it('errors if a non-predicate is passed', () => {
    expect(() => {
      runChecks(
        blueprint(),
        // @ts-ignore Allow invalid type
        { value: 123 },
      );
    }).toThrow('Invalid field "key.value". Must be an instance of "Predicate".');
  });
});
