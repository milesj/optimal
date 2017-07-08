import ObjectBuilder, { object } from '../src/ObjectBuilder';
import { string } from '../src/StringBuilder';

describe('ObjectBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new ObjectBuilder(string());
  });

  describe('constructor()', () => {
    it('errors if a non-builder is passed', () => {
      expect(() => {
        builder = new ObjectBuilder(123);
      }).toThrowError('A blueprint is required for object contents.');
    });

    it('doesnt error if a builder is not passed', () => {
      expect(() => {
        builder = new ObjectBuilder();
      }).not.toThrowError('A blueprint is required for object contents.');
    });

    it('doesnt error if a builder is passed', () => {
      expect(() => {
        builder = new ObjectBuilder(string());
      }).not.toThrowError('A blueprint is required for object contents.');
    });

    it('sets default value', () => {
      builder = new ObjectBuilder(string(), { foo: 'bar' });

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
        builder = new ObjectBuilder();
        builder.runChecks('key', 'foo');
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
      builder = new ObjectBuilder(object(string()));

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
      builder = new ObjectBuilder(object(string()));

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
        func: builder.checkNotEmpty,
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
});

describe('object()', () => {
  it('returns a builder', () => {
    expect(object(string())).toBeInstanceOf(ObjectBuilder);
  });

  it('sets default value', () => {
    const builder = object(string(), { foo: 'bar' });

    expect(builder.defaultValue).toEqual({ foo: 'bar' });
  });
});
