import { bool, BooleanPredicate } from '../../src';
import { runChecks, runInProd } from '../helpers';

describe('BooleanPredicate', () => {
  let predicate: BooleanPredicate<boolean>;

  beforeEach(() => {
    predicate = bool();
  });

  it('returns a predicate', () => {
    expect(bool(true)).toBeInstanceOf(BooleanPredicate);
  });

  it('sets type and default value', () => {
    predicate = bool(true);

    expect(predicate.type).toBe('boolean');
    expect(predicate.defaultValue).toBe(true);
  });

  it('returns default value if value is undefined', () => {
    expect(runChecks(bool(true))).toEqual(true);
  });

  it('returns default value from factory if value is undefined', () => {
    expect(
      runChecks(
        bool(struct => !struct.boop),
        undefined,
        {
          struct: { boop: true },
        },
      ),
    ).toEqual(false);
  });

  it('errors if a non-boolean value is used', () => {
    expect(() => {
      runChecks(
        bool(),
        // @ts-ignore Test invalid type
        123,
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it('returns the type alias', () => {
    expect(bool().typeAlias()).toBe('boolean');
  });

  describe('run()', () => {
    describe('production', () => {
      it(
        'returns default value if value is undefined',
        runInProd(() => {
          expect(runChecks(bool(true))).toBe(true);
        }),
      );

      it(
        'returns default value from factory if value is undefined',
        runInProd(() => {
          expect(runChecks(bool(() => true))).toBe(true);
        }),
      );

      it(
        'bypasses checks and returns value',
        runInProd(() => {
          expect(runChecks(predicate, false)).toBe(false);
        }),
      );
    });
  });

  describe('onlyFalse()', () => {
    beforeEach(() => {
      predicate.onlyFalse();
    });

    it('errors if value is `true`', () => {
      expect(() => {
        runChecks(predicate, true);
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if value is `false`', () => {
      expect(() => {
        runChecks(predicate, false);
      }).not.toThrow();
    });

    it('passes if value is undefined', () => {
      expect(() => {
        runChecks(predicate);
      }).not.toThrow();
    });
  });

  describe('onlyTrue()', () => {
    beforeEach(() => {
      predicate.onlyTrue();
    });

    it('errors if value is `false`', () => {
      expect(() => {
        runChecks(predicate, false);
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if value is `true`', () => {
      expect(() => {
        runChecks(predicate, true);
      }).not.toThrow();
    });

    it('passes if value is undefined', () => {
      expect(() => {
        runChecks(predicate);
      }).not.toThrow();
    });
  });
});
