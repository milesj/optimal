import isString from '../src/isString';

describe('isString()', () => {
  it('returns false for non-strings', () => {
    expect(isString(123)).toBe(false);
    expect(isString([])).toBe(false);
    expect(isString(true)).toBe(false);
  });

  it('returns false for empty strings', () => {
    expect(isString('')).toBe(false);
    expect(isString('foo')).toBe(true);
  });
});
