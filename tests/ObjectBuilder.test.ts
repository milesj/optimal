import ObjectBuilder, { object } from '../src/ObjectBuilder';
import { number } from '../src/NumberBuilder';
import { string } from '../src/StringBuilder';

describe('ObjectBuilder', () => {
  let builder: ObjectBuilder<string, { key: { [key: string]: string } }>;

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
      }).not.toThrowError('A blueprint is required for object contents.');
    });

    it('doesnt error if a builder is passed', () => {
      expect(() => {
        builder = object(string());
      }).not.toThrowError('A blueprint is required for object contents.');
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

    it('checks each item in the object', () => {
      expect(() => {
        builder.runChecks(
          'key',
          {
            a: 'foo',
            b: 'bar',
            // @ts-ignore Test invalid type
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
          {
            // @ts-ignore Test invalid type
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
          {
            a: {
              foo: '123',
              // @ts-ignore Test invalid type
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
      }).not.toThrowError('Invalid field "key". Object cannot be empty.');
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
