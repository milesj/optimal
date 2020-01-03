import NumberBuilder, { number } from '../src/NumberBuilder';
import { runChecks, runInProd } from './helpers';

describe('NumberBuilder', () => {
  let builder: NumberBuilder;

  beforeEach(() => {
    builder = number(123);
  });

  it('sets default value', () => {
    expect(number(456).defaultValue).toBe(456);
  });

  describe('runChecks()', () => {
    it('errors if a non-number value is used', () => {
      expect(() => {
        runChecks(
          number(),
          // @ts-ignore Testing wrong type
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
          number(struct => struct.multiplier * 123),
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
          expect(runChecks(builder)).toBe(123);
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
              builder,
              // @ts-ignore Test invalid type
              '123',
            ),
          ).toBe(123);
        }),
      );
    });
  });

  describe('between()', () => {
    beforeEach(() => {
      builder.between(0, 5);
    });

    it('errors if min is a not a number', () => {
      expect(() => {
        // @ts-ignore Testing wrong type
        builder.between('foo', 5);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if max is a not a number', () => {
      expect(() => {
        // @ts-ignore Testing wrong type
        builder.between(0, 'foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is not a number', () => {
      expect(() => {
        runChecks(
          builder,
          // @ts-ignore Testing wrong type
          'foo',
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if out of range', () => {
      expect(() => {
        runChecks(builder, 10);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if edge of range', () => {
      expect(() => {
        runChecks(builder, 10);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if in range', () => {
      expect(() => {
        runChecks(builder, 3);
      }).not.toThrow();
    });
  });

  describe('between(): inclusive', () => {
    beforeEach(() => {
      builder.between(0, 5, true);
    });

    it('errors if out of range', () => {
      expect(() => {
        runChecks(builder, 10);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if edge of range', () => {
      expect(() => {
        runChecks(builder, 5);
      }).not.toThrow();
    });
  });

  describe('float()', () => {
    beforeEach(() => {
      builder.float();
    });

    it('errors if value is an integer', () => {
      expect(() => {
        runChecks(builder, 123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is NaN', () => {
      expect(() => {
        runChecks(builder, NaN);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value is a float', () => {
      expect(() => {
        runChecks(builder, 1.23);
      }).not.toThrow();
    });
  });

  describe('gt()', () => {
    beforeEach(() => {
      builder.gt(5);
    });

    it('errors if min is a not a number', () => {
      expect(() => {
        // @ts-ignore Testing wrong type
        builder.gt('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if below minimum', () => {
      expect(() => {
        runChecks(builder, 3);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if edge', () => {
      expect(() => {
        runChecks(builder, 5);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if above minimum', () => {
      expect(() => {
        runChecks(builder, 10);
      }).not.toThrow();
    });
  });

  describe('gte()', () => {
    beforeEach(() => {
      builder.gte(5);
    });

    it('errors if min is a not a number', () => {
      expect(() => {
        // @ts-ignore Testing wrong type
        builder.gte('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if below minimum', () => {
      expect(() => {
        runChecks(builder, 3);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if edge', () => {
      expect(() => {
        runChecks(builder, 5);
      }).not.toThrow();
    });

    it('doesnt error if above minimum', () => {
      expect(() => {
        runChecks(builder, 10);
      }).not.toThrow();
    });
  });

  describe('int()', () => {
    beforeEach(() => {
      builder.int();
    });

    it('errors if value is a float', () => {
      expect(() => {
        runChecks(builder, 1.23);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is NaN', () => {
      expect(() => {
        runChecks(builder, NaN);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value is an integer', () => {
      expect(() => {
        runChecks(builder, 123);
      }).not.toThrow();
    });
  });

  describe('lt()', () => {
    beforeEach(() => {
      builder.lt(5);
    });

    it('errors if max is a not a number', () => {
      expect(() => {
        // @ts-ignore Testing wrong type
        builder.lt('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if above maximum', () => {
      expect(() => {
        runChecks(builder, 7);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if edge', () => {
      expect(() => {
        runChecks(builder, 5);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if below maximum', () => {
      expect(() => {
        runChecks(builder, 3);
      }).not.toThrow();
    });
  });

  describe('lte()', () => {
    beforeEach(() => {
      builder.lte(5);
    });

    it('errors if max is a not a number', () => {
      expect(() => {
        // @ts-ignore Testing wrong type
        builder.lte('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if above maximum', () => {
      expect(() => {
        runChecks(builder, 7);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if edge', () => {
      expect(() => {
        runChecks(builder, 5);
      }).not.toThrow();
    });

    it('doesnt error if below maximum', () => {
      expect(() => {
        runChecks(builder, 3);
      }).not.toThrow();
    });
  });

  describe('negative()', () => {
    beforeEach(() => {
      builder.negative();
    });

    it('errors if value is positive', () => {
      expect(() => {
        runChecks(builder, 1);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is zero', () => {
      expect(() => {
        runChecks(builder, 1);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value is negative', () => {
      expect(() => {
        runChecks(builder, -1);
      }).not.toThrow();
    });
  });

  describe('oneOf()', () => {
    beforeEach(() => {
      builder.oneOf([123, 456, 789]);
    });

    it('errors if not an array', () => {
      expect(() => {
        // @ts-ignore Testing wrong type
        builder.oneOf(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if array is empty', () => {
      expect(() => {
        builder.oneOf([]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if array contains a non-number', () => {
      expect(() => {
        // @ts-ignore Testing wrong type
        builder.oneOf(['foo', 123]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is not in the list', () => {
      expect(() => {
        runChecks(builder, 666);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value contains token', () => {
      expect(() => {
        runChecks(builder, 123);
      }).not.toThrow();
    });
  });

  describe('positive()', () => {
    beforeEach(() => {
      builder.positive();
    });

    it('errors if value is negative', () => {
      expect(() => {
        runChecks(builder, -1);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is zero', () => {
      expect(() => {
        runChecks(builder, 0);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value is positive', () => {
      expect(() => {
        runChecks(builder, 1);
      }).not.toThrow();
    });
  });

  describe('typeAlias()', () => {
    it('returns the type name', () => {
      expect(number().typeAlias()).toBe('number');
    });
  });
});
