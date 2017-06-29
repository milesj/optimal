import ObjectBuilder, { objectOf } from '../src/ObjectBuilder';
import { string } from '../src/StringBuilder';

describe('ObjectBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new ObjectBuilder(string());
  });

  describe('constructor()', () => {
    it('errors if a builder is not passed', () => {
      expect(() => {
        builder = new ObjectBuilder();
      }).toThrowError('A blueprint is required for object contents.');
    });

    it('errors if a non-builder is passed', () => {
      expect(() => {
        builder = new ObjectBuilder(123);
      }).toThrowError('A blueprint is required for object contents.');
    });

    it('doesnt error if a builder is passed', () => {
      expect(() => {
        builder = new ObjectBuilder(string());
      }).not.toThrowError('A blueprint is required for object contents.');
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
      builder = new ObjectBuilder(objectOf(string()));

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
      builder = new ObjectBuilder(objectOf(string()));

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
});

describe('objectOf()', () => {
  it('returns a builder', () => {
    expect(objectOf(string())).toBeInstanceOf(ObjectBuilder);
  });
});
