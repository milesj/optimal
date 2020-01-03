/* eslint-disable @typescript-eslint/no-explicit-any */

import ShapeBuilder, { shape } from '../src/ShapeBuilder';
import { bool } from '../src/BooleanBuilder';
import { number } from '../src/NumberBuilder';
import { string } from '../src/StringBuilder';
import { runChecks, runInProd } from './helpers';

describe('ShapeBuilder', () => {
  let builder: ShapeBuilder<{
    foo: string;
    bar: number;
    baz: boolean;
  }>;

  beforeEach(() => {
    builder = shape({
      foo: string(),
      bar: number(),
      baz: bool(),
    });
  });

  it('errors if a non-object is not passed', () => {
    expect(() => {
      // @ts-ignore
      shape('foo');
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if an empty object is passed', () => {
    expect(() => {
      shape({});
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if an object with non-builders is passed', () => {
    expect(() => {
      // @ts-ignore
      shape({ foo: 123 });
    }).toThrowErrorMatchingSnapshot();
  });

  it('doesnt error if a builder object is passed', () => {
    expect(() => {
      shape({
        foo: string(),
      });
    }).not.toThrow();
  });

  describe('runChecks()', () => {
    it('errors if a non-object is passed', () => {
      expect(() => {
        runChecks(
          builder,
          // @ts-ignore Allow invalid type
          'foo',
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors for unknown fields when using exact', () => {
      expect(() => {
        builder.exact();

        runChecks(
          builder,
          // @ts-ignore Allow invalid fields
          { qux: 123, oof: 'abc' },
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error for unknown fields if unknown is true', () => {
      expect(() => {
        builder.runChecks(
          'key',
          // @ts-ignore Allow invalid fields
          { qux: 123, oof: 'abc' },
          {},
          { unknown: true },
        );
      }).not.toThrow();
    });

    it('checks each item in the object', () => {
      expect(() => {
        runChecks(
          builder,
          // @ts-ignore Allow invalid type
          {
            foo: 'foo',
            bar: 'bar',
            baz: true,
          },
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if an object item is invalid; persists path with index', () => {
      expect(() => {
        runChecks(
          builder,
          // @ts-ignore Allow invalid type
          {
            foo: 123,
          },
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('supports shapes of shapes', () => {
      const nestedBuilder = shape({
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

      expect(runChecks(nestedBuilder, data as any)).toEqual({
        foo: {
          ...data.foo,
          c: '',
        },
      });
    });

    it('supports nested required', () => {
      const nestedBuilder = shape({
        foo: string(),
        bar: bool().required(),
      });

      expect(() => {
        runChecks(nestedBuilder, {
          foo: 'abc',
        } as any);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors correctly for shapes in shapes', () => {
      const nestedBuilder = shape({
        foo: shape({
          a: number(),
          b: number(),
          c: string(),
        }),
      });

      expect(() => {
        runChecks(
          nestedBuilder,
          // @ts-ignore Allow invalid type
          {
            foo: {
              a: 123,
              b: 456,
              c: 789,
            },
          },
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('should be the object with defaults', () => {
      expect(runChecks(builder, {} as any)).toEqual({
        bar: 0,
        baz: false,
        foo: '',
      });
    });

    describe('production', () => {
      it(
        'returns default shape if value is object',
        runInProd(() => {
          expect(runChecks(builder, {})).toEqual({ foo: '', bar: 0, baz: false });
        }),
      );

      it(
        'returns default shape if value is undefined',
        runInProd(() => {
          const def = { foo: 'foo', bar: 123, baz: true };
          builder.defaultValue = def;

          expect(runChecks(builder)).toEqual(def);
        }),
      );

      it(
        'bypasses checks and returns value',
        runInProd(() => {
          expect(
            runChecks(
              builder,
              // @ts-ignore Test invalid type
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
