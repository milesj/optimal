import isObject from '../src/isObject';

describe('isObject()', () => {
  it('returns false for non-objects', () => {
    expect(isObject(123)).toBe(false);
    expect(isObject('foo')).toBe(false);
    expect(isObject(true)).toBe(false);
  });

  it('returns false for arrays', () => {
    expect(isObject([])).toBe(false);
    expect(isObject([1, 2, 3])).toBe(false);
  });

  it('returns false for null', () => {
    expect(isObject(null)).toBe(false);
  });

  it('returns true for objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ key: 'value' })).toBe(true);
    expect(isObject(Object.create(null))).toBe(true);
  });
});
