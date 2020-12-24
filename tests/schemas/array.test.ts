import { array, string, ArraySchema } from '../../src/NEW';
import { runChecks, runInProd } from '../helpers';

describe('array()', () => {
  let schema: ArraySchema<string[]>;

  beforeEach(() => {
    schema = array().of(string());
  });

  it('errors if a non-predicate is passed', () => {
    expect(() => {
      // @ts-expect-error Allow non-predicate
      array(123);
    }).toThrowErrorMatchingSnapshot();
  });

  it('doesnt error if a predicate is passed', () => {
    expect(() => {
      array(string());
    }).not.toThrow();
  });

  it('doesnt error if a predicate is not passed', () => {
    expect(() => {
      array();
    }).not.toThrow();
  });

  it('returns an empty array for no data', () => {
    expect(runChecks(schema, [])).toEqual([]);
  });

  it('returns the type name when no contents', () => {
    expect(array().type()).toBe('array');
  });

  it('returns the type name with contents type', () => {
    expect(array().of(string()).type()).toBe('array<string>');
  });

  it('returns default value if value is undefined', () => {
    expect(runChecks(array(['abc']).of(string()))).toEqual(['abc']);
  });

  // it('returns default value from factory if value is undefined', () => {
  //   expect(runChecks(array(string(), () => ['abc']))).toEqual(['abc']);
  // });

  it('errors if a non-array is passed', () => {
    expect(() => {
      runChecks(
        schema,
        // @ts-expect-error Test invalid type
        'foo',
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if a non-array is passed, when not using a predicate', () => {
    expect(() => {
      runChecks(
        array(),
        // @ts-expect-error Test invalid type
        'foo',
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it('checks each item in the array', () => {
    expect(() => {
      runChecks(
        schema,
        // @ts-expect-error Test invalid type
        ['foo', 'bar', 'baz', 123],
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if an array item is invalid; persists path with index', () => {
    expect(() => {
      runChecks(
        schema,
        // @ts-expect-error Test invalid type
        [123],
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it('supports arrays of arrays', () => {
    const nestedPredicate = array().of(array().of(string()));
    const data = [
      ['foo', 'bar'],
      ['baz', 'qux'],
    ];

    expect(runChecks(nestedPredicate, data)).toEqual(data);
  });

  it('errors correctly for arrays in arrays', () => {
    const nestedPredicate = array().of(array().of(string()));

    expect(() => {
      runChecks(nestedPredicate, [
        ['foo', 'bar'],
        // @ts-expect-error Test invalid type
        ['baz', 123],
      ]);
    }).toThrowErrorMatchingSnapshot();
  });

  describe('production', () => {
    it(
      'returns an empty array if value is empty',
      runInProd(() => {
        expect(runChecks(schema, [])).toEqual([]);
      }),
    );

    it(
      'returns default value if value is undefined',
      runInProd(() => {
        expect(runChecks(array(['abc']).of(string()))).toEqual(['abc']);
      }),
    );

    // it(
    //   'returns default value from factory if value is undefined',
    //   runInProd(() => {
    //     expect(runChecks(array(string(), () => ['abc']))).toEqual(['abc']);
    //   }),
    // );

    it(
      'bypasses checks and returns value',
      runInProd(() => {
        expect(
          runChecks(
            schema,
            // @ts-expect-error Test invalid type
            ['foo', 'bar', 'baz', 123],
          ),
        ).toEqual(['foo', 'bar', 'baz', '123']);
      }),
    );
  });

  describe('notEmpty()', () => {
    beforeEach(() => {
      schema.notEmpty();
    });

    it('errors if value is empty', () => {
      expect(() => {
        runChecks(schema, []);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if not empty', () => {
      expect(() => {
        runChecks(schema, ['123']);
      }).not.toThrow();
    });

    it('doesnt error if null', () => {
      expect(() => {
        schema.nullable();

        runChecks(schema, null);
      }).not.toThrow();
    });
  });

  describe('sizeOf()', () => {
    beforeEach(() => {
      schema.sizeOf(3);
    });

    it('errors if length doesnt match', () => {
      expect(() => {
        runChecks(schema, []);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if length matches', () => {
      expect(() => {
        runChecks(schema, ['1', '2', '3']);
      }).not.toThrow();
    });

    it('doesnt error if null', () => {
      expect(() => {
        schema.nullable();

        runChecks(schema, null);
      }).not.toThrow();
    });
  });
});
