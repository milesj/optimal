import { array, object } from '../src/CollectionBuilder';
import { number } from '../src/NumberBuilder';
import { string } from '../src/StringBuilder';

describe('array()', () => {
  let builder;

  beforeEach(() => {
    builder = array(string(), []);
  });

  describe('constructor()', () => {
    it('errors if a non-builder is passed', () => {
      expect(() => {
        builder = array(123);
      }).toThrowError('A blueprint is required for array contents.');
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
      expect(builder.runChecks('key')).toEqual([]);
    });

    it('errors if a non-array is passed', () => {
      expect(() => {
        builder.runChecks('key', 'foo');
      }).toThrowError('Invalid option "key". Must be an array.');
    });

    it('errors if a non-array is passed, when not using a builder', () => {
      expect(() => {
        array().runChecks('key', 'foo');
      }).toThrowError('Invalid option "key". Must be an array.');
    });

    it('checks each item in the array', () => {
      expect(() => {
        builder.runChecks('key', ['foo', 'bar', 'baz', 123]);
      }).toThrowError('Invalid option "key[3]". Must be a string.');
    });

    it('errors if an array item is invalid; persists path with index', () => {
      expect(() => {
        builder.runChecks('key', [123]);
      }).toThrowError('Invalid option "key[0]". Must be a string.');
    });

    it('supports arrays of arrays', () => {
      builder = array(array(string()));

      const data = [['foo', 'bar'], ['baz', 'qux']];

      expect(builder.runChecks('key', data)).toEqual(data);
    });

    it('errors correctly for arrays in arrays', () => {
      builder = array(array(string()));

      expect(() => {
        builder.runChecks('key', [['foo', 'bar'], ['baz', 123]]);
      }).toThrowError('Invalid option "key[1][1]". Must be a string.');
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
      }).toThrowError('Invalid option "key". Array cannot be empty.');
    });

    it('doesnt error if not empty', () => {
      expect(() => {
        builder.checkNotEmpty('key', [123]);
      }).not.toThrowError('Invalid option "key". Array cannot be empty.');
    });
  });

  describe('typeAlias()', () => {
    it('returns the type name when no contents', () => {
      expect(array().typeAlias()).toBe('Array');
    });

    it('returns the type name with contents type', () => {
      expect(array(string()).typeAlias()).toBe('Array<String>');
    });
  });
});

describe('object()', () => {
  let builder;

  beforeEach(() => {
    builder = object(string(), {});
  });

  describe('constructor()', () => {
    it('errors if a non-builder is passed', () => {
      expect(() => {
        builder = object(123);
      }).toThrowError('A blueprint is required for object contents.');
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
      expect(builder.runChecks('key')).toEqual({});
    });

    it('errors if a non-object is passed', () => {
      expect(() => {
        builder.runChecks('key', 'foo');
      }).toThrowError('Invalid option "key". Must be a plain object.');
    });

    it('errors if a non-object is passed, when not using a builder', () => {
      expect(() => {
        object().runChecks('key', 'foo');
      }).toThrowError('Invalid option "key". Must be a plain object.');
    });

    it('checks each item in the object', () => {
      expect(() => {
        builder.runChecks('key', {
          a: 'foo',
          b: 'bar',
          c: 123,
        });
      }).toThrowError('Invalid option "key.c". Must be a string.');
    });

    it('errors if an object item is invalid; persists path with index', () => {
      expect(() => {
        builder.runChecks('key', {
          foo: 123,
        });
      }).toThrowError('Invalid option "key.foo". Must be a string.');
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

      expect(builder.runChecks('key', data)).toEqual(data);
    });

    it('errors correctly for objects in objects', () => {
      builder = object(object(string()));

      expect(() => {
        builder.runChecks('key', {
          a: {
            foo: '123',
            bar: 456,
          },
          b: {
            baz: '789',
          },
        });
      }).toThrowError('Invalid option "key.a.bar". Must be a string.');
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
      }).toThrowError('Invalid option "key". Object cannot be empty.');
    });

    it('doesnt error if not empty', () => {
      expect(() => {
        builder.checkNotEmpty('key', { foo: 123 });
      }).not.toThrowError('Invalid option "key". Object cannot be empty.');
    });
  });

  describe('typeAlias()', () => {
    it('returns the type name when no contents', () => {
      expect(object().typeAlias()).toBe('Object');
    });

    it('returns the type name with contents type', () => {
      expect(object(number()).typeAlias()).toBe('Object<Number>');
    });
  });
});
