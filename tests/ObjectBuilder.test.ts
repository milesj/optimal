import ObjectBuilder, { object, blueprint } from '../src/ObjectBuilder';
import { number } from '../src/NumberBuilder';
import { string } from '../src/StringBuilder';

describe('ObjectBuilder', () => {
  let builder: ObjectBuilder<string>;

  beforeEach(() => {
    builder = object(string(), {});
  });

  describe('constructor()', () => {
    it('errors if a non-builder is passed', () => {
      expect(() => {
        // @ts-ignore Allow non-builder
        builder = object(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if a builder is not passed', () => {
      expect(() => {
        object();
      }).not.toThrow('A blueprint is required for object contents.');
    });

    it('doesnt error if a builder is passed', () => {
      expect(() => {
        builder = object(string());
      }).not.toThrow('A blueprint is required for object contents.');
    });

    it('sets type and default value', () => {
      builder = object(string(), { foo: 'bar' });

      expect(builder.type).toBe('object');
      expect(builder.defaultValue).toEqual({ foo: 'bar' });
    });
  });

  describe('runChecks()', () => {
    it('returns an empty object for no data', () => {
      expect(builder.runChecks('key', {}, { key: {} })).toEqual({});
    });

    it('errors if a non-object is passed', () => {
      expect(() => {
        // @ts-ignore Test invalid type
        builder.runChecks('key', 'foo', {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if a non-object is passed, when not using a builder', () => {
      expect(() => {
        // @ts-ignore Test invalid type
        object().runChecks('key', 'foo', {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns default value if value is undefined', () => {
      expect(
        object(string(), { foo: 'foo' }).runChecks('key', undefined, { key: undefined }),
      ).toEqual({ foo: 'foo' });
    });

    it('returns default value from factory if value is undefined', () => {
      expect(
        object(string(), () => ({ foo: 'bar' })).runChecks('key', undefined, {
          key: undefined,
          multiplier: 3,
        }),
      ).toEqual({ foo: 'bar' });
    });

    it('checks each item in the object', () => {
      expect(() => {
        builder.runChecks(
          'key',
          // @ts-ignore Test invalid type
          {
            a: 'foo',
            b: 'bar',
            c: 123,
          },
          {},
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if an object item is invalid; persists path with index', () => {
      expect(() => {
        builder.runChecks(
          'key',
          // @ts-ignore Test invalid type
          {
            foo: 123,
          },
          {},
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

      expect(nestedBuilder.runChecks('key', data, {})).toEqual(data);
    });

    it('errors correctly for objects in objects', () => {
      const nestedBuilder = object(object(string()));

      expect(() => {
        nestedBuilder.runChecks(
          'key',
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
          {},
        );
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('notEmpty()', () => {
    it('adds a checker', () => {
      builder.notEmpty();

      expect(builder.checks[2]).toEqual({
        callback: builder.checkNotEmpty,
        args: [],
      });
    });
  });

  describe('checkNotEmpty()', () => {
    it('errors if value is empty', () => {
      expect(() => {
        builder.checkNotEmpty('key', {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if not empty', () => {
      expect(() => {
        builder.checkNotEmpty('key', { foo: '123' });
      }).not.toThrow('Invalid field "key". Object cannot be empty.');
    });
  });

  describe('sizeOf()', () => {
    it('adds a checker', () => {
      builder.sizeOf(3);

      expect(builder.checks[2]).toEqual({
        callback: builder.checkSizeOf,
        args: [3],
      });
    });
  });

  describe('checkSizeOf()', () => {
    it('errors if length doesnt match', () => {
      expect(() => {
        builder.checkSizeOf('key', {}, 3);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if length matches', () => {
      expect(() => {
        builder.checkSizeOf('key', { a: '1', b: '2', c: '3' }, 3);
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
      blueprint().runChecks(
        'key',
        // @ts-ignore Allow invalid type
        { value: 123 },
        {},
      );
    }).toThrow('Invalid field "key.value". Must be an instance of "Builder".');
  });
});
