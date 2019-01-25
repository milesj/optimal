import StringBuilder, { string } from '../src/StringBuilder';

describe('StringBuilder', () => {
  let builder: StringBuilder<{ key: string }>;

  beforeEach(() => {
    builder = string('foo');
  });

  describe('constructor()', () => {
    it('sets default value', () => {
      expect(string('bar').defaultValue).toBe('bar');
    });
  });

  describe('runChecks()', () => {
    it('errors if a non-string value is used', () => {
      expect(() => {
        // @ts-ignore Testing wrong type
        builder.runChecks('key', 123, { key: 123 });
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('contains()', () => {
    it('errors if token is not string', () => {
      expect(() => {
        // @ts-ignore Testing wrong type
        builder.contains(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if token is an empty string', () => {
      expect(() => {
        builder.contains('');
      }).toThrowErrorMatchingSnapshot();
    });

    it('adds a checker', () => {
      builder.contains('oo');

      expect(builder.checks[2]).toEqual({
        callback: builder.checkContains,
        args: ['oo', 0],
      });
    });
  });

  describe('checkContains()', () => {
    it('errors if value does not contain token', () => {
      expect(() => {
        builder.checkContains('key', 'bar', 'oo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value contains token', () => {
      expect(() => {
        builder.checkContains('key', 'foo', 'oo');
      }).not.toThrowError('Invalid field "key". String does not include "oo".');
    });
  });

  describe('match()', () => {
    it('errors if pattern is not a regex', () => {
      expect(() => {
        // @ts-ignore Testing wrong type
        builder.match(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('adds a checker', () => {
      builder.match(/oo/u);

      expect(builder.checks[2]).toEqual({
        callback: builder.checkMatch,
        args: [/oo/u],
      });
    });
  });

  describe('checkMatch()', () => {
    it('errors if value does not match pattern', () => {
      expect(() => {
        builder.checkMatch('key', 'bar', /oo/u);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value matches pattern', () => {
      expect(() => {
        builder.checkMatch('key', 'foo', /oo/u);
      }).not.toThrowError('Invalid field "key". String does not match pattern "oo".');
    });
  });

  describe('empty()', () => {
    it('allows empty', () => {
      builder.empty();

      expect(builder.allowEmpty).toBe(true);
    });
  });

  describe('checkNotEmpty()', () => {
    it('errors if value is empty', () => {
      expect(() => {
        builder.checkNotEmpty('key', '');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if allow empty', () => {
      expect(() => {
        builder.empty().checkNotEmpty('key', '');
      }).not.toThrowError('Invalid field "key". String cannot be empty.');
    });
  });

  describe('oneOf()', () => {
    it('errors if not an array', () => {
      expect(() => {
        // @ts-ignore Testing wrong type
        builder.oneOf(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if array is empty', () => {
      expect(() => {
        builder.oneOf([]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if array contains a non-string', () => {
      expect(() => {
        // @ts-ignore Testing wrong type
        builder.oneOf(['foo', 123]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('adds a checker', () => {
      builder.oneOf(['foo', 'bar', 'baz']);

      expect(builder.checks[2]).toEqual({
        callback: builder.checkOneOf,
        args: [['foo', 'bar', 'baz']],
      });
    });
  });

  describe('checkOneOf()', () => {
    it('errors if value is not in the list', () => {
      expect(() => {
        builder.checkOneOf('key', 'qux', ['foo', 'bar', 'baz']);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value contains token', () => {
      expect(() => {
        builder.checkOneOf('key', 'foo', ['foo', 'bar', 'baz']);
      }).not.toThrowError('Invalid field "key". String must be one of: foo, bar, baz');
    });
  });

  describe('typeAlias()', () => {
    it('returns the type name', () => {
      expect(string().typeAlias()).toBe('string');
    });
  });
});
