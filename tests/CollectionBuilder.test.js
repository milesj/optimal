import CollectionBuilder, { array, object } from '../src/CollectionBuilder';
import { string } from '../src/StringBuilder';

describe('CollectionBuilder', () => {
  let builder;

  describe('array', () => {
    beforeEach(() => {
      builder = new CollectionBuilder('array', string(), []);
    });

    describe('constructor()', () => {
      it('errors if a non-builder is passed', () => {
        expect(() => {
          builder = new CollectionBuilder('array', 123);
        }).toThrowError('A blueprint is required for array contents.');
      });

      it('doesnt error if a builder is not passed', () => {
        expect(() => {
          builder = new CollectionBuilder('array');
        }).not.toThrowError('A blueprint is required for array contents.');
      });

      it('doesnt error if a builder is passed', () => {
        expect(() => {
          builder = new CollectionBuilder('array', string());
        }).not.toThrowError('A blueprint is required for array contents.');
      });

      it('sets default value', () => {
        builder = new CollectionBuilder('array', string(), ['foo']);

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
          builder = new CollectionBuilder('array');
          builder.runChecks('key', 'foo');
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
        builder = new CollectionBuilder('array', array(string()));

        const data = [
          ['foo', 'bar'],
          ['baz', 'qux'],
        ];

        expect(builder.runChecks('key', data)).toEqual(data);
      });

      it('errors correctly for arrays in arrays', () => {
        builder = new CollectionBuilder('array', array(string()));

        expect(() => {
          builder.runChecks('key', [
            ['foo', 'bar'],
            ['baz', 123],
          ]);
        }).toThrowError('Invalid option "key[1][1]". Must be a string.');
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
          builder.checkNotEmpty('key', []);
        }).toThrowError('Invalid option "key". Array cannot be empty.');
      });

      it('doesnt error if not empty', () => {
        expect(() => {
          builder.checkNotEmpty('key', [123]);
        }).not.toThrowError('Invalid option "key". Array cannot be empty.');
      });
    });
  });

  describe('object', () => {
    beforeEach(() => {
      builder = new CollectionBuilder('object', string(), {});
    });

    describe('constructor()', () => {
      it('errors if a non-builder is passed', () => {
        expect(() => {
          builder = new CollectionBuilder('object', 123);
        }).toThrowError('A blueprint is required for object contents.');
      });

      it('doesnt error if a builder is not passed', () => {
        expect(() => {
          builder = new CollectionBuilder('object');
        }).not.toThrowError('A blueprint is required for object contents.');
      });

      it('doesnt error if a builder is passed', () => {
        expect(() => {
          builder = new CollectionBuilder('object', string());
        }).not.toThrowError('A blueprint is required for object contents.');
      });

      it('sets default value', () => {
        builder = new CollectionBuilder('object', string(), { foo: 'bar' });

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
          builder = new CollectionBuilder('object');
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
        builder = new CollectionBuilder('object', object(string()));

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
        builder = new CollectionBuilder('object', object(string()));

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
});

describe('array()', () => {
  it('returns a builder', () => {
    expect(array(string())).toBeInstanceOf(CollectionBuilder);
  });

  it('sets type and default value', () => {
    const builder = array(string(), ['foo']);

    expect(builder.type).toBe('array');
    expect(builder.defaultValue).toEqual(['foo']);
  });
});

describe('object()', () => {
  it('returns a builder', () => {
    expect(object(string())).toBeInstanceOf(CollectionBuilder);
  });

  it('sets type and default value', () => {
    const builder = object(string(), { foo: 'bar' });

    expect(builder.type).toBe('object');
    expect(builder.defaultValue).toEqual({ foo: 'bar' });
  });
});
