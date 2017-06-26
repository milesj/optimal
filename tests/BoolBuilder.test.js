import BoolBuilder, { bool } from '../src/BoolBuilder';

describe('BoolBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new BoolBuilder(true);
  });

  it('errors if a non-boolean value is used', () => {
    expect(() => {
      builder.runChecks('key', 123);
    }).toThrowError('Invalid option "key". Must be a boolean.');
  });

  it('errors if a null value is used', () => {
    expect(() => {
      builder.runChecks('key', null);
    }).toThrowError('Invalid option "key". Must be a boolean.');
  });

  describe('only()', () => {
    it('errors if default value is not boolean', () => {
      builder.defaultValue = 123;

      expect(() => {
        builder.only();
      }).toThrowError('bool.only() requires a default boolean value.');
    });

    it('adds a checker', () => {
      builder.only();

      expect(builder.checks[1]).toEqual({
        func: builder.checkOnly,
        args: [],
      });
    });
  });

  describe('checkOnly()', () => {
    beforeEach(() => {
      builder.only();
    });

    it('errors if value doesnt match the default value', () => {
      expect(() => {
        builder.checkOnly('key', false);
      }).toThrowError('Invalid option "key". Boolean may only be true.');
    });

    it('doesnt error if value matches default value', () => {
      expect(() => {
        builder.checkOnly('key', true);
      }).not.toThrowError('Invalid option "key". Boolean may only be true.');
    });
  });
});

describe('bool()', () => {
  it('returns a builder', () => {
    expect(bool(true)).toBeInstanceOf(BoolBuilder);
  });
});
