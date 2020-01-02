import BooleanBuilder, { bool } from '../src/BooleanBuilder';
import { runChecks } from './helpers';

describe('BooleanBuilder', () => {
  let builder: BooleanBuilder<boolean>;

  beforeEach(() => {
    builder = bool();
  });

  it('returns a builder', () => {
    expect(bool(true)).toBeInstanceOf(BooleanBuilder);
  });

  it('sets type and default value', () => {
    builder = bool(true);

    expect(builder.type).toBe('boolean');
    expect(builder.defaultValue).toBe(true);
  });

  it('returns default value if value is undefined', () => {
    expect(runChecks(bool(true))).toEqual(true);
  });

  it('returns default value from factory if value is undefined', () => {
    expect(
      bool(struct => !struct.boop).runChecks('key', undefined, {
        key: undefined,
        boop: true,
      }),
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

  describe('onlyFalse()', () => {
    beforeEach(() => {
      builder.onlyFalse();
    });

    it('errors if value is `true`', () => {
      expect(() => {
        runChecks(builder, true);
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if value is `false`', () => {
      expect(() => {
        runChecks(builder, false);
      }).not.toThrow();
    });

    it('passes if value is undefined', () => {
      expect(() => {
        runChecks(builder);
      }).not.toThrow();
    });
  });

  describe('onlyTrue()', () => {
    beforeEach(() => {
      builder.onlyTrue();
    });

    it('errors if value is `false`', () => {
      expect(() => {
        runChecks(builder, false);
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if value is `true`', () => {
      expect(() => {
        runChecks(builder, true);
      }).not.toThrow();
    });

    it('passes if value is undefined', () => {
      expect(() => {
        runChecks(builder);
      }).not.toThrow();
    });
  });
});
