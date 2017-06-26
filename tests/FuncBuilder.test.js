import FuncBuilder, { func } from '../src/FuncBuilder';

describe('FuncBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new FuncBuilder();
  });

  it('errors if a non-function value is used', () => {
    expect(() => {
      builder.runChecks('key', 123);
    }).toThrowError('Invalid option "key". Must be a function.');
  });

  it('allows nulls', () => {
    expect(() => {
      builder.runChecks('key', null);
    }).not.toThrowError('Invalid option "key". Must be a function.');
  });
});

describe('func()', () => {
  it('returns a builder', () => {
    expect(func()).toBeInstanceOf(FuncBuilder);
  });
});
