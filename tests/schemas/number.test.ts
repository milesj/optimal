import { number, NumberSchema } from '../../src/NEW';
import { runChecks, runInProd } from '../helpers';

describe('number()', () => {
  let schema: NumberSchema;

  beforeEach(() => {
    schema = number(123);
  });

  it('errors if a non-number value is used', () => {
    expect(() => {
      runChecks(
        number(),
        // @ts-expect-error Testing wrong type
        'foo',
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it('returns the type alias', () => {
    expect(number().type()).toBe('number');
  });

  it('returns default value if value is undefined', () => {
    expect(runChecks(number(123))).toBe(123);
  });

  // it('returns default value from factory if value is undefined', () => {
  //   expect(
  //     runChecks(
  //       number((struct) => struct.multiplier * 123),
  //       undefined,
  //       {
  //         struct: { multiplier: 3 },
  //       },
  //     ),
  //   ).toEqual(369);
  // });

  describe('production', () => {
    it(
      'returns default value if value is undefined',
      runInProd(() => {
        expect(runChecks(schema)).toBe(123);
      }),
    );

    // it(
    //   'returns default value from factory if value is undefined',
    //   runInProd(() => {
    //     expect(runChecks(number(() => 456))).toBe(456);
    //   }),
    // );

    it(
      'bypasses checks and returns value',
      runInProd(() => {
        expect(
          runChecks(
            schema,
            // @ts-expect-error Test invalid type
            '123',
          ),
        ).toBe(123);
      }),
    );
  });

  describe('between()', () => {
    beforeEach(() => {
      schema.between(0, 5);
    });

    it('errors if min is a not a number', () => {
      expect(() => {
        // @ts-expect-error Testing wrong type
        schema.between('foo', 5);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if max is a not a number', () => {
      expect(() => {
        // @ts-expect-error Testing wrong type
        schema.between(0, 'foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is not a number', () => {
      expect(() => {
        runChecks(
          schema,
          // @ts-expect-error Testing wrong type
          'foo',
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if out of range', () => {
      expect(() => {
        runChecks(schema, 10);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if edge of range', () => {
      expect(() => {
        runChecks(schema, 10);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if in range', () => {
      expect(() => {
        runChecks(schema, 3);
      }).not.toThrow();
    });
  });

  describe('between(): inclusive', () => {
    beforeEach(() => {
      schema.between(0, 5, true);
    });

    it('errors if out of range', () => {
      expect(() => {
        runChecks(schema, 10);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if edge of range', () => {
      expect(() => {
        runChecks(schema, 5);
      }).not.toThrow();
    });
  });

  describe('float()', () => {
    beforeEach(() => {
      schema.float();
    });

    it('errors if value is an integer', () => {
      expect(() => {
        runChecks(schema, 123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is NaN', () => {
      expect(() => {
        runChecks(schema, Number.NaN);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value is a float', () => {
      expect(() => {
        runChecks(schema, 1.23);
      }).not.toThrow();
    });
  });

  describe('gt()', () => {
    beforeEach(() => {
      schema.gt(5);
    });

    it('errors if min is a not a number', () => {
      expect(() => {
        // @ts-expect-error Testing wrong type
        schema.gt('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if below minimum', () => {
      expect(() => {
        runChecks(schema, 3);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if edge', () => {
      expect(() => {
        runChecks(schema, 5);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if above minimum', () => {
      expect(() => {
        runChecks(schema, 10);
      }).not.toThrow();
    });
  });

  describe('gte()', () => {
    beforeEach(() => {
      schema.gte(5);
    });

    it('errors if min is a not a number', () => {
      expect(() => {
        // @ts-expect-error Testing wrong type
        schema.gte('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if below minimum', () => {
      expect(() => {
        runChecks(schema, 3);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if edge', () => {
      expect(() => {
        runChecks(schema, 5);
      }).not.toThrow();
    });

    it('doesnt error if above minimum', () => {
      expect(() => {
        runChecks(schema, 10);
      }).not.toThrow();
    });
  });

  describe('int()', () => {
    beforeEach(() => {
      schema.int();
    });

    it('errors if value is a float', () => {
      expect(() => {
        runChecks(schema, 1.23);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is NaN', () => {
      expect(() => {
        runChecks(schema, Number.NaN);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value is an integer', () => {
      expect(() => {
        runChecks(schema, 123);
      }).not.toThrow();
    });
  });

  describe('lt()', () => {
    beforeEach(() => {
      schema.lt(5);
    });

    it('errors if max is a not a number', () => {
      expect(() => {
        // @ts-expect-error Testing wrong type
        schema.lt('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if above maximum', () => {
      expect(() => {
        runChecks(schema, 7);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if edge', () => {
      expect(() => {
        runChecks(schema, 5);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if below maximum', () => {
      expect(() => {
        runChecks(schema, 3);
      }).not.toThrow();
    });
  });

  describe('lte()', () => {
    beforeEach(() => {
      schema.lte(5);
    });

    it('errors if max is a not a number', () => {
      expect(() => {
        // @ts-expect-error Testing wrong type
        schema.lte('foo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if above maximum', () => {
      expect(() => {
        runChecks(schema, 7);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if edge', () => {
      expect(() => {
        runChecks(schema, 5);
      }).not.toThrow();
    });

    it('doesnt error if below maximum', () => {
      expect(() => {
        runChecks(schema, 3);
      }).not.toThrow();
    });
  });

  describe('negative()', () => {
    beforeEach(() => {
      schema.negative();
    });

    it('errors if value is positive', () => {
      expect(() => {
        runChecks(schema, 1);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is zero', () => {
      expect(() => {
        runChecks(schema, 1);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value is negative', () => {
      expect(() => {
        runChecks(schema, -1);
      }).not.toThrow();
    });
  });

  describe('oneOf()', () => {
    beforeEach(() => {
      schema.oneOf([123, 456, 789]);
    });

    it('errors if not an array', () => {
      expect(() => {
        // @ts-expect-error Testing wrong type
        schema.oneOf(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if array is empty', () => {
      expect(() => {
        schema.oneOf([]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if array contains a non-number', () => {
      expect(() => {
        // @ts-expect-error Testing wrong type
        schema.oneOf(['foo', 123]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is not in the list', () => {
      expect(() => {
        runChecks(schema, 666);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value contains token', () => {
      expect(() => {
        runChecks(schema, 123);
      }).not.toThrow();
    });
  });

  describe('positive()', () => {
    beforeEach(() => {
      schema.positive();
    });

    it('errors if value is negative', () => {
      expect(() => {
        runChecks(schema, -1);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is zero', () => {
      expect(() => {
        runChecks(schema, 0);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value is positive', () => {
      expect(() => {
        runChecks(schema, 1);
      }).not.toThrow();
    });
  });
});
