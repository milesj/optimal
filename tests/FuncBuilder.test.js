import FuncBuilder, { func } from '../src/FuncBuilder';

describe('FuncBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new FuncBuilder();
  });

  describe('runChecks()', () => {
    it('errors if a non-function value is used', () => {
      expect(() => {
        builder.runChecks('key', 123);
      }).toThrowError('Invalid option "key". Must be a function.');
    });

    it('supports null', () => {
      expect(builder.runChecks('key', null)).toBe(null);
    });
  });
});

describe('func()', () => {
  it('returns a builder', () => {
    expect(func()).toBeInstanceOf(FuncBuilder);
  });
});
