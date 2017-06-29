import RegexBuilder, { regex } from '../src/RegexBuilder';

describe('RegexBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new RegexBuilder();
  });

  describe('runChecks()', () => {
    it('errors if a non-regex value is used', () => {
      expect(() => {
        builder.runChecks('key', 123);
      }).toThrowError('Invalid option "key". Must be a `RegExp`.');
    });

    it('doesnt error if a regex value is used', () => {
      expect(() => {
        builder.runChecks('key', /foo/);
      }).not.toThrowError('Invalid option "key". Must be a `RegExp`.');
    });

    it('allows nulls', () => {
      expect(() => {
        builder.runChecks('key', null);
      }).not.toThrowError('Invalid option "key". Must be a `RegExp`.');
    });
  });
});

describe('regex()', () => {
  it('returns a builder', () => {
    expect(regex()).toBeInstanceOf(RegexBuilder);
  });
});
