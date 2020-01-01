import ArrayBuilder, { array } from '../src/ArrayBuilder';
import { string } from '../src/StringBuilder';

describe('ArrayBuilder', () => {
  let builder: ArrayBuilder<string>;

  beforeEach(() => {
    builder = array(string());
  });

  describe('constructor()', () => {
    it('errors if a non-builder is passed', () => {
      expect(() => {
        // @ts-ignore Allow non-builder
        builder = array(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if a builder is not passed', () => {
      expect(() => {
        builder = array();
      }).not.toThrow('A blueprint is required for array contents.');
    });

    it('doesnt error if a builder is passed', () => {
      expect(() => {
        builder = array(string());
      }).not.toThrow('A blueprint is required for array contents.');
    });

    it('sets type and default value', () => {
      builder = array(string(), ['foo']);

      expect(builder.type).toBe('array');
      expect(builder.defaultValue).toEqual(['foo']);
    });
  });

  describe('runChecks()', () => {
    it('returns an empty array for no data', () => {
      expect(builder.runChecks('key', [], { key: [] })).toEqual([]);
    });

    it('returns default value if value is undefined', () => {
      expect(array(string(), ['abc']).runChecks('key', undefined, { key: undefined })).toEqual([
        'abc',
      ]);
    });

    it('returns default value from factory if value is undefined', () => {
      expect(
        array(string(), () => ['abc']).runChecks('key', undefined, {
          key: undefined,
        }),
      ).toEqual(['abc']);
    });

    it('errors if a non-array is passed', () => {
      expect(() => {
        // @ts-ignore Test invalid type
        builder.runChecks('key', 'foo', { key: [] });
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if a non-array is passed, when not using a builder', () => {
      expect(() => {
        // @ts-ignore Test invalid type
        array().runChecks('key', 'foo', {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('checks each item in the array', () => {
      expect(() => {
        builder.runChecks(
          'key',
          // @ts-ignore Test invalid type
          ['foo', 'bar', 'baz', 123],
          { key: [] },
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if an array item is invalid; persists path with index', () => {
      expect(() => {
        // @ts-ignore Test invalid type
        builder.runChecks('key', [123], {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('supports arrays of arrays', () => {
      const nestedBuilder = array(array(string()));

      const data = [
        ['foo', 'bar'],
        ['baz', 'qux'],
      ];

      expect(nestedBuilder.runChecks('key', data, {})).toEqual(data);
    });

    it('errors correctly for arrays in arrays', () => {
      const nestedBuilder = array(array(string()));

      expect(() => {
        nestedBuilder.runChecks(
          'key',
          // @ts-ignore Test invalid type
          [
            ['foo', 'bar'],
            ['baz', 123],
          ],
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
        builder.checkNotEmpty('key', []);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if not empty', () => {
      expect(() => {
        builder.checkNotEmpty('key', ['123']);
      }).not.toThrow('Invalid field "key". Array cannot be empty.');
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
        builder.checkSizeOf('key', [], 3);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if length matches', () => {
      expect(() => {
        builder.checkSizeOf('key', ['1', '2', '3'], 3);
      }).not.toThrow();
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
