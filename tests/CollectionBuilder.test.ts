import CollectionBuilder, { array, object } from '../src/CollectionBuilder';
import { number } from '../src/NumberBuilder';
import { string } from '../src/StringBuilder';

describe('array()', () => {
  let builder: CollectionBuilder<any, any>;

  beforeEach(() => {
    builder = array(string(), []);
  });

  describe('constructor()', () => {
    it('errors if a non-builder is passed', () => {
      expect(() => {
        // @ts-ignore
        builder = array(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if a builder is not passed', () => {
      expect(() => {
        builder = array();
      }).not.toThrowError('A blueprint is required for array contents.');
    });

    it('doesnt error if a builder is passed', () => {
      expect(() => {
        builder = array(string());
      }).not.toThrowError('A blueprint is required for array contents.');
    });

    it('sets type and default value', () => {
      builder = array(string(), ['foo']);

      expect(builder.type).toBe('array');
      expect(builder.defaultValue).toEqual(['foo']);
    });
  });

  describe('runChecks()', () => {
    it('returns an empty array for no data', () => {
      expect(builder.runChecks('key', [], {})).toEqual([]);
    });

    it('errors if a non-array is passed', () => {
      expect(() => {
        builder.runChecks('key', 'foo', {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if a non-array is passed, when not using a builder', () => {
      expect(() => {
        array().runChecks('key', 'foo', {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('checks each item in the array', () => {
      expect(() => {
        builder.runChecks('key', ['foo', 'bar', 'baz', 123], {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if an array item is invalid; persists path with index', () => {
      expect(() => {
        builder.runChecks('key', [123], {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('supports arrays of arrays', () => {
      builder = array(array(string()));

      const data = [['foo', 'bar'], ['baz', 'qux']];

      expect(builder.runChecks('key', data, {})).toEqual(data);
    });

    it('errors correctly for arrays in arrays', () => {
      builder = array(array(string()));

      expect(() => {
        builder.runChecks('key', [['foo', 'bar'], ['baz', 123]], {});
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
        builder.checkNotEmpty('key', []);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if not empty', () => {
      expect(() => {
        builder.checkNotEmpty('key', [123]);
      }).not.toThrowError('Invalid field "key". Array cannot be empty.');
    });
  });

  describe('typeAlias()', () => {
    it('returns the type name when no contents', () => {
      expect(array().typeAlias()).toBe('array');
    });

    it('returns the type name with contents type', () => {
      expect(array(string()).typeAlias()).toBe('array<string>');
    });
  });
});

describe('object()', () => {
  let builder: CollectionBuilder<any, any>;

  beforeEach(() => {
    builder = object(string(), {});
  });

  describe('constructor()', () => {
    it('errors if a non-builder is passed', () => {
      expect(() => {
        // @ts-ignore
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
      expect(builder.runChecks('key', {}, {})).toEqual({});
    });

    it('errors if a non-object is passed', () => {
      expect(() => {
        builder.runChecks('key', 'foo', {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if a non-object is passed, when not using a builder', () => {
      expect(() => {
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
            foo: 123,
          },
          {},
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('supports objects of objects', () => {
      builder = object(object(string()));

      const data = {
        a: {
          foo: '123',
          bar: '456',
        },
        b: {
          baz: '789',
        },
      };

      expect(builder.runChecks('key', data, {})).toEqual(data);
    });

    it('errors correctly for objects in objects', () => {
      builder = object(object(string()));

      expect(() => {
        builder.runChecks(
          'key',
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
        builder.checkNotEmpty('key', { foo: 123 });
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
