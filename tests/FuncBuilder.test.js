import FuncBuilder, { func } from '../src/FuncBuilder';

describe('FuncBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new FuncBuilder();
  });

  describe('constructor()', () => {
    it('sets default value', () => {
      const noop = () => {};
      builder = new FuncBuilder(noop);

      expect(builder.defaultValue).toBe(noop);
    });
  });

  describe('runChecks()', () => {
    it('errors if a non-function value is used', () => {
      expect(() => {
        builder.runChecks('key', 123);
      }).toThrowError('Invalid option "key". Must be a function.');
    });
  });
});

describe('func()', () => {
  it('returns a builder', () => {
    expect(func()).toBeInstanceOf(FuncBuilder);
  });

  it('sets default value', () => {
    const noop = () => {};
    const builder = func(noop);

    expect(builder.defaultValue).toBe(noop);
  });
});
