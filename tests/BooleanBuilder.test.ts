import BooleanBuilder, { bool } from '../src/BooleanBuilder';

describe('BooleanBuilder', () => {
  let builder: BooleanBuilder<boolean>;

  beforeEach(() => {
    builder = bool();
  });

  describe('bool()', () => {
    it('returns a builder', () => {
      expect(bool(true)).toBeInstanceOf(BooleanBuilder);
    });

    it('sets type and default value', () => {
      builder = bool(true);

      expect(builder.type).toBe('boolean');
      expect(builder.defaultValue).toBe(true);
    });

    it('returns default value if value is undefined', () => {
      expect(bool(true).runChecks('key', undefined, { key: undefined })).toEqual(true);
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
        bool().runChecks(
          'key',
          // @ts-ignore Test invalid type
          123,
          {},
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns the type alias', () => {
      expect(bool().typeAlias()).toBe('boolean');
    });
  });

  describe('onlyFalse()', () => {
    it('adds a checker', () => {
      builder.onlyFalse();

      expect(builder.checks[1]).toEqual({
        callback: builder.checkOnlyFalse,
        args: [],
      });
    });

    it('errors if value is `true`', () => {
      builder.onlyFalse();

      expect(() => {
        builder.runChecks('key', true, { key: true });
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if value is `false`', () => {
      builder.onlyFalse();

      expect(() => {
        expect(builder.runChecks('key', false, { key: false })).toBe(false);
      }).not.toThrow();
    });

    it('passes if value is undefined', () => {
      builder.onlyFalse();

      expect(() => {
        expect(builder.runChecks('key', undefined, { key: undefined })).toBe(false);
      }).not.toThrow();
    });
  });

  describe('onlyTrue()', () => {
    it('adds a checker', () => {
      builder.onlyTrue();

      expect(builder.checks[1]).toEqual({
        callback: builder.checkOnlyTrue,
        args: [],
      });
    });

    it('errors if value is `false`', () => {
      builder.onlyTrue();

      expect(() => {
        builder.runChecks('key', false, { key: false });
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if value is `true`', () => {
      builder.onlyTrue();

      expect(() => {
        expect(builder.runChecks('key', true, { key: true })).toBe(true);
      }).not.toThrow();
    });

    it('passes if value is undefined', () => {
      builder.onlyTrue();

      expect(() => {
        expect(builder.runChecks('key', undefined, { key: undefined })).toBe(true);
      }).not.toThrow();
    });
  });
});
