import { array, ArrayPredicate,string } from '../../src';
import { runChecks, runInProd } from '../helpers';

describe('ArrayPredicate', () => {
  let predicate: ArrayPredicate<string>;

  beforeEach(() => {
    predicate = array(string());
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

  it('sets type and default value', () => {
    predicate = array(string(), ['foo']);

    expect(predicate.type).toBe('array');
    expect(predicate.defaultValue).toEqual(['foo']);
  });

  describe('default()', () => {
    it('returns the default value', () => {
      expect(array(string(), ['a', 'b', 'c']).default()).toEqual(['a', 'b', 'c']);
    });
  });

  describe('run()', () => {
    it('returns an empty array for no data', () => {
      expect(runChecks(predicate, [])).toEqual([]);
    });

    it('returns default value if value is undefined', () => {
      expect(runChecks(array(string(), ['abc']))).toEqual(['abc']);
    });

    it('returns default value from factory if value is undefined', () => {
      expect(runChecks(array(string(), () => ['abc']))).toEqual(['abc']);
    });

    it('errors if a non-array is passed', () => {
      expect(() => {
        runChecks(
          predicate,
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
          predicate,
          // @ts-expect-error Test invalid type
          ['foo', 'bar', 'baz', 123],
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if an array item is invalid; persists path with index', () => {
      expect(() => {
        runChecks(
          predicate,
          // @ts-expect-error Test invalid type
          [123],
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('supports arrays of arrays', () => {
      const nestedPredicate = array(array(string()));
      const data = [
        ['foo', 'bar'],
        ['baz', 'qux'],
      ];

      expect(runChecks(nestedPredicate, data)).toEqual(data);
    });

    it('errors correctly for arrays in arrays', () => {
      const nestedPredicate = array(array(string()));

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
          expect(runChecks(predicate, [])).toEqual([]);
        }),
      );

      it(
        'returns default value if value is undefined',
        runInProd(() => {
          expect(runChecks(array(string(), ['abc']))).toEqual(['abc']);
        }),
      );

      it(
        'returns default value from factory if value is undefined',
        runInProd(() => {
          expect(runChecks(array(string(), () => ['abc']))).toEqual(['abc']);
        }),
      );

      it(
        'bypasses checks and returns value',
        runInProd(() => {
          expect(
            runChecks(
              predicate,
              // @ts-expect-error Test invalid type
              ['foo', 'bar', 'baz', 123],
            ),
          ).toEqual(['foo', 'bar', 'baz', '123']);
        }),
      );
    });
  });

  describe('notEmpty()', () => {
    beforeEach(() => {
      predicate.notEmpty();
    });

    it('errors if value is empty', () => {
      expect(() => {
        runChecks(predicate, []);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if not empty', () => {
      expect(() => {
        runChecks(predicate, ['123']);
      }).not.toThrow();
    });

    it('doesnt error if null', () => {
      expect(() => {
        predicate.nullable();

        runChecks(predicate, null);
      }).not.toThrow();
    });
  });

  describe('sizeOf()', () => {
    beforeEach(() => {
      predicate.sizeOf(3);
    });

    it('errors if length doesnt match', () => {
      expect(() => {
        runChecks(predicate, []);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if length matches', () => {
      expect(() => {
        runChecks(predicate, ['1', '2', '3']);
      }).not.toThrow();
    });

    it('doesnt error if null', () => {
      expect(() => {
        predicate.nullable();

        runChecks(predicate, null);
      }).not.toThrow();
    });
  });

  describe('typeAlias()', () => {
    it('returns the type name when no contents', () => {
      expect(array().typeAlias()).toBe('array');
    });

    it('returns the type name with contents type', () => {
      expect(array(string()).typeAlias()).toBe('array<string>');
    });
  });
});
