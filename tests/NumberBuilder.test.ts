import { number } from '../src/NumberBuilder';

describe('NumberBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = number(123);
  });

  describe('constructor()', () => {
    it('sets default value', () => {
      expect(number(456).defaultValue).toBe(456);
    });
  });

  describe('runChecks()', () => {
    it('errors if a non-number value is used', () => {
      expect(() => {
        number().runChecks('key', 'foo', {});
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('between()', () => {
    it('errors if min is a not a number', () => {
      expect(() => {
        builder.between('foo', 5);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if max is a not a number', () => {
      expect(() => {
        builder.between(0, 'foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('adds a checker', () => {
      builder.between(0, 5);

      expect(builder.checks[1]).toEqual({
        callback: builder.checkBetween,
        args: [0, 5, false],
      });
    });
  });

  describe('checkBetween()', () => {
    it('errors if value is not a number', () => {
      expect(() => {
        builder.checkBetween('key', 'foo', 0, 5);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if out of range', () => {
      expect(() => {
        builder.checkBetween('key', 10, 0, 5);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if out of range inclusive', () => {
      expect(() => {
        builder.checkBetween('key', 10, 0, 5, true);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if in range', () => {
      expect(() => {
        builder.checkBetween('key', 3, 0, 5);
      }).not.toThrowError('Invalid field "key". Number must be between 0 and 5.');
    });

    it('doesnt error if in range inclusive', () => {
      expect(() => {
        builder.checkBetween('key', 5, 0, 5, true);
      }).not.toThrowError('Invalid field "key". Number must be between 0 and 5 inclusive.');
    });
  });

  describe('gt()', () => {
    it('errors if min is a not a number', () => {
      expect(() => {
        builder.gt('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('adds a checker', () => {
      builder.gt(5);

      expect(builder.checks[1]).toEqual({
        callback: builder.checkGreaterThan,
        args: [5, false],
      });
    });
  });

  describe('gte()', () => {
    it('errors if min is a not a number', () => {
      expect(() => {
        builder.gte('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('adds a checker', () => {
      builder.gte(5);

      expect(builder.checks[1]).toEqual({
        callback: builder.checkGreaterThan,
        args: [5, true],
      });
    });
  });

  describe('checkGreaterThan()', () => {
    it('errors if value is not a number', () => {
      expect(() => {
        builder.checkGreaterThan('key', 'foo', 5);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if below minimum', () => {
      expect(() => {
        builder.checkGreaterThan('key', 3, 5);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if below minimum inclusive', () => {
      expect(() => {
        builder.checkGreaterThan('key', 3, 5, true);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if above minimum', () => {
      expect(() => {
        builder.checkGreaterThan('key', 10, 5);
      }).not.toThrowError('Invalid field "key". Number must be greater than 5.');
    });

    it('doesnt error if above minimum inclusive', () => {
      expect(() => {
        builder.checkGreaterThan('key', 5, 5, true);
      }).not.toThrowError('Invalid field "key". Number must be greater than or equal to 5.');
    });
  });

  describe('lt()', () => {
    it('errors if max is a not a number', () => {
      expect(() => {
        builder.lt('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('adds a checker', () => {
      builder.lt(5);

      expect(builder.checks[1]).toEqual({
        callback: builder.checkLessThan,
        args: [5, false],
      });
    });
  });

  describe('lte()', () => {
    it('errors if max is a not a number', () => {
      expect(() => {
        builder.lte('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('adds a checker', () => {
      builder.lte(5);

      expect(builder.checks[1]).toEqual({
        callback: builder.checkLessThan,
        args: [5, true],
      });
    });
  });

  describe('checkLessThan()', () => {
    it('errors if value is not a number', () => {
      expect(() => {
        builder.checkLessThan('key', 'foo', 5);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if above maximum', () => {
      expect(() => {
        builder.checkLessThan('key', 7, 5);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if above maximum inclusive', () => {
      expect(() => {
        builder.checkLessThan('key', 7, 5, true);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if below maximum', () => {
      expect(() => {
        builder.checkLessThan('key', 3, 5);
      }).not.toThrowError('Invalid field "key". Number must be less than 5.');
    });

    it('doesnt error if below maximum inclusive', () => {
      expect(() => {
        builder.checkLessThan('key', 5, 5, true);
      }).not.toThrowError('Invalid field "key". Number must be less than or equal to 5.');
    });
  });

  describe('oneOf()', () => {
    it('errors if not an array', () => {
      expect(() => {
        builder.oneOf(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if array is empty', () => {
      expect(() => {
        builder.oneOf([]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if array contains a non-number', () => {
      expect(() => {
        builder.oneOf(['foo', 123]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('adds a checker', () => {
      builder.oneOf([123, 456, 789]);

      expect(builder.checks[1]).toEqual({
        callback: builder.checkOneOf,
        args: [[123, 456, 789]],
      });
    });
  });

  describe('checkOneOf()', () => {
    it('errors if value is not in the list', () => {
      expect(() => {
        builder.checkOneOf('key', 666, [123, 456, 789]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value contains token', () => {
      expect(() => {
        builder.checkOneOf('key', 123, [123, 456, 789]);
      }).not.toThrowError('Invalid field "key". Number must be one of: 123, 456, 789');
    });
  });

  describe('typeAlias()', () => {
    it('returns the type name', () => {
      expect(number().typeAlias()).toBe('number');
    });
  });
});
