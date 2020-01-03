import ObjectBuilder, { object, blueprint } from '../src/ObjectBuilder';
import { number } from '../src/NumberBuilder';
import { string } from '../src/StringBuilder';
import { runChecks, runInProd } from './helpers';

describe('ObjectBuilder', () => {
  let builder: ObjectBuilder<string>;

  beforeEach(() => {
    builder = object(string(), {});
  });

  it('errors if a non-builder is passed', () => {
    expect(() => {
      // @ts-ignore Allow non-builder
      builder = object(123);
    }).toThrowErrorMatchingSnapshot();
  });

  it('doesnt error if a builder is not passed', () => {
    expect(() => {
      object();
    }).not.toThrow();
  });

  it('doesnt error if a builder is passed', () => {
    expect(() => {
      builder = object(string());
    }).not.toThrow();
  });

  it('sets type and default value', () => {
    builder = object(string(), { foo: 'bar' });

    expect(builder.type).toBe('object');
    expect(builder.defaultValue).toEqual({ foo: 'bar' });
  });

  describe('runChecks()', () => {
    it('returns an empty object for no data', () => {
      expect(runChecks(builder)).toEqual({});
    });

    it('errors if a non-object is passed', () => {
      expect(() => {
        runChecks(
          builder,
          // @ts-ignore Test invalid type
          'foo',
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if a non-object is passed, when not using a builder', () => {
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
          builder,
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
          builder,
          // @ts-ignore Test invalid type
          {
            foo: 123,
          },
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('supports objects of objects', () => {
      const nestedBuilder = object(object(string()));

      const data = {
        a: {
          foo: '123',
          bar: '456',
        },
        b: {
          baz: '789',
        },
      };

      expect(runChecks(nestedBuilder, data)).toEqual(data);
    });

    it('errors correctly for objects in objects', () => {
      const nestedBuilder = object(object(string()));

      expect(() => {
        runChecks(
          nestedBuilder,
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
          expect(runChecks(builder, {})).toEqual({});
        }),
      );

      it(
        'returns default value if value is undefined',
        runInProd(() => {
          const def = { foo: 'foo' };
          builder.defaultValue = def;

          expect(runChecks(builder)).toEqual(def);
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
              builder,
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
      builder.notEmpty();
    });

    it('errors if value is empty', () => {
      expect(() => {
        runChecks(builder, {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if not empty', () => {
      expect(() => {
        runChecks(builder, { foo: '123' });
      }).not.toThrow();
    });
  });

  describe('sizeOf()', () => {
    beforeEach(() => {
      builder.sizeOf(3);
    });

    it('errors if length doesnt match', () => {
      expect(() => {
        runChecks(builder, {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if length matches', () => {
      expect(() => {
        runChecks(builder, { a: '1', b: '2', c: '3' });
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
  it('returns a builder for Date', () => {
    expect(blueprint()).toBeInstanceOf(ObjectBuilder);
  });

  it('errors if a non-Builder is passed', () => {
    expect(() => {
      runChecks(
        blueprint(),
        // @ts-ignore Allow invalid type
        { value: 123 },
      );
    }).toThrow('Invalid field "key.value". Must be an instance of "Builder".');
  });
});
