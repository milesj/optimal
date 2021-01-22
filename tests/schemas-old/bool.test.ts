import { bool, BoolSchema } from '../../src/NEW';
import { runChecks, runInProd } from '../helpers';

describe('bool()', () => {
  let schema: BoolSchema;

  beforeEach(() => {
    schema = bool();
  });

  it('errors if a non-boolean value is used', () => {
    expect(() => {
      runChecks(
        bool(),
        // @ts-expect-error
        123,
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it('returns the type alias', () => {
    expect(bool().type()).toBe('boolean');
  });

  it('returns default value if value is undefined', () => {
    expect(runChecks(bool(true))).toBe(true);
  });

  // it('returns default value from factory if value is undefined', () => {
  //   expect(
  //     runChecks(
  //       bool((struct) => !struct.boop),
  //       undefined,
  //       {
  //         struct: { boop: true },
  //       },
  //     ),
  //   ).toEqual(false);
  // });

  describe('production', () => {
    it(
      'returns default value if value is undefined',
      runInProd(() => {
        expect(runChecks(bool(true))).toBe(true);
      }),
    );

    // it(
    //   'returns default value from factory if value is undefined',
    //   runInProd(() => {
    //     expect(runChecks(bool(() => true))).toBe(true);
    //   }),
    // );

    it(
      'bypasses checks and returns value',
      runInProd(() => {
        expect(runChecks(schema, false)).toBe(false);
      }),
    );
  });

  describe('onlyFalse()', () => {
    beforeEach(() => {
      schema.onlyFalse();
    });

    it('errors if value is `true`', () => {
      expect(() => {
        runChecks(schema, true);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is `null`', () => {
      expect(() => {
        runChecks(schema, null);
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if value is `false`', () => {
      expect(() => {
        runChecks(schema, false);
      }).not.toThrow();
    });

    it('passes if value is undefined', () => {
      expect(() => {
        runChecks(schema);
      }).not.toThrow();
    });
  });

  describe('onlyTrue()', () => {
    beforeEach(() => {
      schema.onlyTrue();
    });

    it('errors if value is `false`', () => {
      expect(() => {
        runChecks(schema, false);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is `null`', () => {
      expect(() => {
        runChecks(schema, null);
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if value is `true`', () => {
      expect(() => {
        runChecks(schema, true);
      }).not.toThrow();
    });

    it('passes if value is undefined', () => {
      expect(() => {
        runChecks(schema);
      }).not.toThrow();
    });
  });
});
