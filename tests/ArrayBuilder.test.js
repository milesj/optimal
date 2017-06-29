import ArrayBuilder, { arrayOf } from '../src/ArrayBuilder';
import { string } from '../src/StringBuilder';

describe('ArrayBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new ArrayBuilder(string());
  });

  describe('constructor()', () => {
    it('errors if a builder is not passed', () => {
      expect(() => {
        builder = new ArrayBuilder();
      }).toThrowError('A blueprint is required for array contents.');
    });

    it('errors if a non-builder is passed', () => {
      expect(() => {
        builder = new ArrayBuilder(123);
      }).toThrowError('A blueprint is required for array contents.');
    });

    it('doesnt error if a builder is passed', () => {
      expect(() => {
        builder = new ArrayBuilder(string());
      }).not.toThrowError('A blueprint is required for array contents.');
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
      builder = new ArrayBuilder(arrayOf(string()));

      const data = [
        ['foo', 'bar'],
        ['baz', 'qux'],
      ];

      expect(builder.runChecks('key', data)).toEqual(data);
    });

    it('errors correctly for arrays in arrays', () => {
      builder = new ArrayBuilder(arrayOf(string()));

      expect(() => {
        builder.runChecks('key', [
          ['foo', 'bar'],
          ['baz', 123],
        ]);
      }).toThrowError('Invalid option "key[1][1]". Must be a string.');
    });
  });
});

describe('arrayOf()', () => {
  it('returns a builder', () => {
    expect(arrayOf(string())).toBeInstanceOf(ArrayBuilder);
  });
});
