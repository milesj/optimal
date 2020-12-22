import { bool, number, object, shape, ShapePredicate, string } from '../../src';
import { runChecks, runInProd } from '../helpers';

describe('ShapePredicate', () => {
  let predicate: ShapePredicate<{
    foo: string;
    bar: number;
    baz: boolean;
  }>;

  beforeEach(() => {
    predicate = shape({
      foo: string(),
      bar: number(),
      baz: bool(),
    });
  });

  it('errors if a non-object is not passed', () => {
    expect(() => {
      // @ts-expect-error
      shape('foo');
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if an empty object is passed', () => {
    expect(() => {
      shape({});
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if an object with non-predicates is passed', () => {
    expect(() => {
      // @ts-expect-error
      shape({ foo: 123 });
    }).toThrowErrorMatchingSnapshot();
  });

  it('doesnt error if a predicate object is passed', () => {
    expect(() => {
      shape({
        foo: string(),
      });
    }).not.toThrow();
  });

  describe('default()', () => {
    it('returns the default value', () => {
      expect(predicate.default()).toEqual({ foo: '', bar: 0, baz: false });
    });
  });

  describe('run()', () => {
    it('errors if a non-object is passed', () => {
      expect(() => {
        runChecks(
          predicate,
          // @ts-expect-error Allow invalid type
          'foo',
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors for unknown fields when using exact', () => {
      expect(() => {
        predicate.exact();

        runChecks(
          predicate,
          // @ts-expect-error Allow invalid fields
          { qux: 123, oof: 'abc' },
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error for unknown fields if unknown is true', () => {
      expect(() => {
        runChecks(
          predicate,
          // @ts-expect-error Allow invalid fields
          { qux: 123, oof: 'abc' },
        );
      }).not.toThrow();
    });

    it('checks each item in the object', () => {
      expect(() => {
        runChecks(predicate, {
          foo: 'foo',
          // @ts-expect-error Allow invalid type
          bar: 'bar',
          baz: true,
        });
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if an object item is invalid; persists path with index', () => {
      expect(() => {
        runChecks(predicate, {
          // @ts-expect-error Allow invalid type
          foo: 123,
        });
      }).toThrowErrorMatchingSnapshot();
    });

    it('supports shapes of shapes', () => {
      const nestedPredicate = shape({
        foo: shape({
          a: number(),
          b: number(),
          c: string(),
        }),
      });

      const data = {
        foo: {
          a: 123,
          b: 456,
        },
      };

      expect(runChecks(nestedPredicate, data as any)).toEqual({
        foo: {
          ...data.foo,
          c: '',
        },
      });
    });

    it('supports nested required', () => {
      const nestedPredicate = shape({
        foo: string(),
        bar: bool().required(),
      });

      expect(() => {
        runChecks(nestedPredicate, {
          foo: 'abc',
        } as any);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors correctly for shapes in shapes', () => {
      const nestedPredicate = shape({
        foo: shape({
          a: number(),
          b: number(),
          c: string(),
        }),
      });

      expect(() => {
        runChecks(nestedPredicate, {
          foo: {
            a: 123,
            b: 456,
            // @ts-expect-error Allow invalid type
            c: 789,
          },
        });
      }).toThrowErrorMatchingSnapshot();
    });

    it('should be the object with defaults', () => {
      expect(runChecks(predicate, {} as any)).toEqual({
        bar: 0,
        baz: false,
        foo: '',
      });
    });

    it('passes correct value to nested predicates', () => {
      const customShape = shape({
        attributes: object(string(), null).notEmpty().nullable(),
        nullable: bool(),
        optional: bool(),
        reference: string(),
        type: string('shape').notEmpty(),
      });

      expect(runChecks(customShape, {} as any)).toEqual({
        attributes: null,
        nullable: false,
        optional: false,
        reference: '',
        type: 'shape',
      });
    });

    describe('production', () => {
      it(
        'returns default shape if value is undefined',
        runInProd(() => {
          expect(runChecks(predicate)).toEqual({ foo: '', bar: 0, baz: false });
        }),
      );

      it(
        'returns default shape if value is an empty object',
        runInProd(() => {
          expect(runChecks(predicate, {})).toEqual({ foo: '', bar: 0, baz: false });
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
          ).toEqual({ foo: '123', bar: 0, baz: false });
        }),
      );
    });
  });

  describe('typeAlias()', () => {
    it('returns the type name', () => {
      expect(
        shape({
          a: number(),
          b: number(),
          c: string(),
        }).typeAlias(),
      ).toBe('shape');
    });
  });
});
