import BoolBuilder, { bool } from '../src/BoolBuilder';

describe('BoolBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new BoolBuilder(true);
  });

  describe('constructor()', () => {
    it('sets default value', () => {
      builder = new BoolBuilder(true);

      expect(builder.defaultValue).toBe(true);
    });
  });

  describe('runChecks()', () => {
    it('errors if a non-boolean value is used', () => {
      expect(() => {
        builder.runChecks('key', 123);
      }).toThrowError('Invalid option "key". Must be a boolean.');
    });

    it('doesnt support null', () => {
      expect(() => {
        builder.runChecks('key', null);
      }).toThrowError('Invalid option "key". Must be a boolean.');
    });
  });
});

describe('bool()', () => {
  it('returns a builder', () => {
    expect(bool(true)).toBeInstanceOf(BoolBuilder);
  });

  it('sets default value', () => {
    const builder = bool(true);

    expect(builder.defaultValue).toBe(true);
  });
});
