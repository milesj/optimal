import { string } from '../src/StringBuilder';

describe('StringBuilder', () => {
  let builder;

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
        builder.runChecks('key', 123);
      }).toThrowError('Invalid option "key". Must be a string.');
    });
  });

  describe('contains()', () => {
    it('errors if token is not string', () => {
      expect(() => {
        builder.contains(123);
      }).toThrowError('Contains requires a non-empty string.');
    });

    it('errors if token is an empty string', () => {
      expect(() => {
        builder.contains('');
      }).toThrowError('Contains requires a non-empty string.');
    });

    it('adds a checker', () => {
      builder.contains('oo');

      expect(builder.checks[2]).toEqual({
        func: builder.checkContains,
        args: ['oo', 0],
      });
    });
  });

  describe('checkContains()', () => {
    it('errors if value does not contain token', () => {
      expect(() => {
        builder.checkContains('key', 'bar', 'oo');
      }).toThrowError('Invalid option "key". String does not include "oo".');
    });

    it('doesnt error if value contains token', () => {
      expect(() => {
        builder.checkContains('key', 'foo', 'oo');
      }).not.toThrowError('Invalid option "key". String does not include "oo".');
    });
  });

  describe('match()', () => {
    it('errors if pattern is not a regex', () => {
      expect(() => {
        builder.match(123);
      }).toThrowError('Match requires a regular expression to match against.');
    });

    it('adds a checker', () => {
      builder.match(/oo/);

      expect(builder.checks[2]).toEqual({
        func: builder.checkMatch,
        args: [/oo/],
      });
    });
  });

  describe('checkMatch()', () => {
    it('errors if value does not match pattern', () => {
      expect(() => {
        builder.checkMatch('key', 'bar', /oo/);
      }).toThrowError('Invalid option "key". String does not match pattern "oo".');
    });

    it('doesnt error if value matches pattern', () => {
      expect(() => {
        builder.checkMatch('key', 'foo', /oo/);
      }).not.toThrowError('Invalid option "key". String does not match pattern "oo".');
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
      }).toThrowError('Invalid option "key". String cannot be empty.');
    });

    it('doesnt error if allow empty', () => {
      expect(() => {
        builder.empty().checkNotEmpty('key', '');
      }).not.toThrowError('Invalid option "key". String cannot be empty.');
    });
  });

  describe('oneOf()', () => {
    it('errors if not an array', () => {
      expect(() => {
        builder.oneOf(123);
      }).toThrowError('One of requires a non-empty array of strings.');
    });

    it('errors if array is empty', () => {
      expect(() => {
        builder.oneOf([]);
      }).toThrowError('One of requires a non-empty array of strings.');
    });

    it('errors if array contains a non-string', () => {
      expect(() => {
        builder.oneOf(['foo', 123]);
      }).toThrowError('One of requires a non-empty array of strings.');
    });

    it('adds a checker', () => {
      builder.oneOf(['foo', 'bar', 'baz']);

      expect(builder.checks[2]).toEqual({
        func: builder.checkOneOf,
        args: [['foo', 'bar', 'baz']],
      });
    });
  });

  describe('checkOneOf()', () => {
    it('errors if value is not in the list', () => {
      expect(() => {
        builder.checkOneOf('key', 'qux', ['foo', 'bar', 'baz']);
      }).toThrowError('Invalid option "key". String must be one of: foo, bar, baz');
    });

    it('doesnt error if value contains token', () => {
      expect(() => {
        builder.checkOneOf('key', 'foo', ['foo', 'bar', 'baz']);
      }).not.toThrowError('Invalid option "key". String must be one of: foo, bar, baz');
    });
  });

  describe('typeAlias()', () => {
    it('returns the type name', () => {
      expect(string().typeAlias()).toBe('String');
    });
  });
});