import invariant from '../src/invariant';

describe('invariant()', () => {
  it('does nothing if condition is true', () => {
    expect(() => {
      invariant(true);
    }).not.toThrowError();
  });

  it('errors if condition is false', () => {
    expect(() => {
      invariant(false, 'Failure');
    }).toThrowError('Failure');
  });

  it('includes an option path', () => {
    expect(() => {
      invariant(false, 'Failure', 'foo.bar');
    }).toThrowError('Invalid option "foo.bar". Failure');
  });
});
