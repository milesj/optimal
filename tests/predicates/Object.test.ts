import { blueprint, number, object, ObjectPredicate,string } from '../../src';
import { runChecks, runInProd } from '../helpers';

describe('ObjectPredicate', () => {
  let predicate: ObjectPredicate<string>;

  beforeEach(() => {
    predicate = object(string(), {});
  });

  it('errors if a non-predicate is passed', () => {
    expect(() => {
      // @ts-expect-error Allow non-predicate
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

  describe('default()', () => {
    it('returns the default value', () => {
      expect(object(string(), { a: 'a' }).default()).toEqual({ a: 'a' });
    });

    it('returns the default value for mapped types', () => {
      expect(
        object<string, 'bar' | 'baz' | 'foo'>(string(), { foo: 'a', bar: 'b', baz: 'c' }).default(),
      ).toEqual({ foo: 'a', bar: 'b', baz: 'c' });
    });
  });

  describe('run()', () => {
    it('returns an empty object for no data', () => {
      expect(runChecks(predicate)).toEqual({});
    });

    it('errors if a non-object is passed', () => {
      expect(() => {
        runChecks(
          predicate,
          // @ts-expect-error Test invalid type
          'foo',
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if a non-object is passed, when not using a predicate', () => {
      expect(() => {
        runChecks(
          object(),
          // @ts-expect-error Test invalid type
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
        runChecks(predicate, {
          a: 'foo',
          b: 'bar',
          // @ts-expect-error Test invalid type
          c: 123,
        });
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if an object item is invalid; persists path with index', () => {
      expect(() => {
        runChecks(predicate, {
          // @ts-expect-error Test invalid type
          foo: 123,
        });
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
        runChecks(nestedPredicate, {
          a: {
            foo: '123',
            // @ts-expect-error Test invalid type
            bar: 456,
          },
          b: {
            baz: '789',
          },
        });
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
              // @ts-expect-error Test invalid type
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

    it('doesnt error if null', () => {
      expect(() => {
        predicate.nullable();

        runChecks(predicate, null);
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

    it('doesnt error if null', () => {
      expect(() => {
        predicate.nullable();

        runChecks(predicate, null);
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
        // @ts-expect-error Allow invalid type
        { value: 123 },
      );
    }).toThrow('Invalid field "key.value". Must be an instance of "Predicate".');
  });
});
