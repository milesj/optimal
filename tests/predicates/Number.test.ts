import { number, NumberPredicate } from '../../src';
import { runChecks, runInProd } from '../helpers';

describe('NumberPredicate', () => {
  let predicate: NumberPredicate;

  beforeEach(() => {
    predicate = number(123);
  });

  it('sets default value', () => {
    expect(number(456).defaultValue).toBe(456);
  });

  describe('default()', () => {
    it('returns the default value', () => {
      expect(predicate.default()).toBe(123);
    });
  });

  describe('run()', () => {
    it('errors if a non-number value is used', () => {
      expect(() => {
        runChecks(
          number(),
          // @ts-expect-error Testing wrong type
          'foo',
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns default value if value is undefined', () => {
      expect(runChecks(number(123))).toEqual(123);
    });

    it('returns default value from factory if value is undefined', () => {
      expect(
        runChecks(
          number((struct) => struct.multiplier * 123),
          undefined,
          {
            struct: { multiplier: 3 },
          },
        ),
      ).toEqual(369);
    });

    describe('production', () => {
      it(
        'returns default value if value is undefined',
        runInProd(() => {
          expect(runChecks(predicate)).toBe(123);
        }),
      );

      it(
        'returns default value from factory if value is undefined',
        runInProd(() => {
          expect(runChecks(number(() => 456))).toBe(456);
        }),
      );

      it(
        'bypasses checks and returns value',
        runInProd(() => {
          expect(
            runChecks(
              predicate,
              // @ts-expect-error Test invalid type
              '123',
            ),
          ).toBe(123);
        }),
      );
    });
  });

  describe('between()', () => {
    beforeEach(() => {
      predicate.between(0, 5);
    });

    it('errors if min is a not a number', () => {
      expect(() => {
        // @ts-expect-error Testing wrong type
        predicate.between('foo', 5);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if max is a not a number', () => {
      expect(() => {
        // @ts-expect-error Testing wrong type
        predicate.between(0, 'foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is not a number', () => {
      expect(() => {
        runChecks(
          predicate,
          // @ts-expect-error Testing wrong type
          'foo',
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if out of range', () => {
      expect(() => {
        runChecks(predicate, 10);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if edge of range', () => {
      expect(() => {
        runChecks(predicate, 10);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if in range', () => {
      expect(() => {
        runChecks(predicate, 3);
      }).not.toThrow();
    });
  });

  describe('between(): inclusive', () => {
    beforeEach(() => {
      predicate.between(0, 5, true);
    });

    it('errors if out of range', () => {
      expect(() => {
        runChecks(predicate, 10);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if edge of range', () => {
      expect(() => {
        runChecks(predicate, 5);
      }).not.toThrow();
    });
  });

  describe('float()', () => {
    beforeEach(() => {
      predicate.float();
    });

    it('errors if value is an integer', () => {
      expect(() => {
        runChecks(predicate, 123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is NaN', () => {
      expect(() => {
        runChecks(predicate, Number.NaN);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value is a float', () => {
      expect(() => {
        runChecks(predicate, 1.23);
      }).not.toThrow();
    });
  });

  describe('gt()', () => {
    beforeEach(() => {
      predicate.gt(5);
    });

    it('errors if min is a not a number', () => {
      expect(() => {
        // @ts-expect-error Testing wrong type
        predicate.gt('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if below minimum', () => {
      expect(() => {
        runChecks(predicate, 3);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if edge', () => {
      expect(() => {
        runChecks(predicate, 5);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if above minimum', () => {
      expect(() => {
        runChecks(predicate, 10);
      }).not.toThrow();
    });
  });

  describe('gte()', () => {
    beforeEach(() => {
      predicate.gte(5);
    });

    it('errors if min is a not a number', () => {
      expect(() => {
        // @ts-expect-error Testing wrong type
        predicate.gte('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if below minimum', () => {
      expect(() => {
        runChecks(predicate, 3);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if edge', () => {
      expect(() => {
        runChecks(predicate, 5);
      }).not.toThrow();
    });

    it('doesnt error if above minimum', () => {
      expect(() => {
        runChecks(predicate, 10);
      }).not.toThrow();
    });
  });

  describe('int()', () => {
    beforeEach(() => {
      predicate.int();
    });

    it('errors if value is a float', () => {
      expect(() => {
        runChecks(predicate, 1.23);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is NaN', () => {
      expect(() => {
        runChecks(predicate, Number.NaN);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value is an integer', () => {
      expect(() => {
        runChecks(predicate, 123);
      }).not.toThrow();
    });
  });

  describe('lt()', () => {
    beforeEach(() => {
      predicate.lt(5);
    });

    it('errors if max is a not a number', () => {
      expect(() => {
        // @ts-expect-error Testing wrong type
        predicate.lt('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if above maximum', () => {
      expect(() => {
        runChecks(predicate, 7);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if edge', () => {
      expect(() => {
        runChecks(predicate, 5);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if below maximum', () => {
      expect(() => {
        runChecks(predicate, 3);
      }).not.toThrow();
    });
  });

  describe('lte()', () => {
    beforeEach(() => {
      predicate.lte(5);
    });

    it('errors if max is a not a number', () => {
      expect(() => {
        // @ts-expect-error Testing wrong type
        predicate.lte('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if above maximum', () => {
      expect(() => {
        runChecks(predicate, 7);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if edge', () => {
      expect(() => {
        runChecks(predicate, 5);
      }).not.toThrow();
    });

    it('doesnt error if below maximum', () => {
      expect(() => {
        runChecks(predicate, 3);
      }).not.toThrow();
    });
  });

  describe('negative()', () => {
    beforeEach(() => {
      predicate.negative();
    });

    it('errors if value is positive', () => {
      expect(() => {
        runChecks(predicate, 1);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is zero', () => {
      expect(() => {
        runChecks(predicate, 1);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value is negative', () => {
      expect(() => {
        runChecks(predicate, -1);
      }).not.toThrow();
    });
  });

  describe('oneOf()', () => {
    beforeEach(() => {
      predicate.oneOf([123, 456, 789]);
    });

    it('errors if not an array', () => {
      expect(() => {
        // @ts-expect-error Testing wrong type
        predicate.oneOf(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if array is empty', () => {
      expect(() => {
        predicate.oneOf([]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if array contains a non-number', () => {
      expect(() => {
        // @ts-expect-error Testing wrong type
        predicate.oneOf(['foo', 123]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is not in the list', () => {
      expect(() => {
        runChecks(predicate, 666);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value contains token', () => {
      expect(() => {
        runChecks(predicate, 123);
      }).not.toThrow();
    });
  });

  describe('positive()', () => {
    beforeEach(() => {
      predicate.positive();
    });

    it('errors if value is negative', () => {
      expect(() => {
        runChecks(predicate, -1);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is zero', () => {
      expect(() => {
        runChecks(predicate, 0);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value is positive', () => {
      expect(() => {
        runChecks(predicate, 1);
      }).not.toThrow();
    });
  });

  describe('typeAlias()', () => {
    it('returns the type name', () => {
      expect(number().typeAlias()).toBe('number');
    });
  });
});
