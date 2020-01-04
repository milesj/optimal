import { array, string, ArrayPredicate } from '../../src';
import { runChecks, runInProd } from '../helpers';

describe('ArrayPredicate', () => {
  let builder: ArrayPredicate<string>;

  beforeEach(() => {
    builder = array(string());
  });

  it('errors if a non-builder is passed', () => {
    expect(() => {
      // @ts-ignore Allow non-builder
      array(123);
    }).toThrowErrorMatchingSnapshot();
  });

  it('doesnt error if a builder is passed', () => {
    expect(() => {
      array(string());
    }).not.toThrow();
  });

  it('doesnt error if a builder is not passed', () => {
    expect(() => {
      array();
    }).not.toThrow();
  });

  it('sets type and default value', () => {
    builder = array(string(), ['foo']);

    expect(builder.type).toBe('array');
    expect(builder.defaultValue).toEqual(['foo']);
  });

  describe('run()', () => {
    it('returns an empty array for no data', () => {
      expect(runChecks(builder, [])).toEqual([]);
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
          builder,
          // @ts-ignore Test invalid type
          'foo',
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if a non-array is passed, when not using a builder', () => {
      expect(() => {
        runChecks(
          array(),
          // @ts-ignore Test invalid type
          'foo',
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('checks each item in the array', () => {
      expect(() => {
        runChecks(
          builder,
          // @ts-ignore Test invalid type
          ['foo', 'bar', 'baz', 123],
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if an array item is invalid; persists path with index', () => {
      expect(() => {
        runChecks(
          builder,
          // @ts-ignore Test invalid type
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
        runChecks(
          nestedPredicate,
          // @ts-ignore Test invalid type
          [
            ['foo', 'bar'],
            ['baz', 123],
          ],
        );
      }).toThrowErrorMatchingSnapshot();
    });

    describe('production', () => {
      it(
        'returns an empty array if value is empty',
        runInProd(() => {
          expect(runChecks(builder, [])).toEqual([]);
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
              builder,
              // @ts-ignore Test invalid type
              ['foo', 'bar', 'baz', 123],
            ),
          ).toEqual(['foo', 'bar', 'baz', '123']);
        }),
      );
    });
  });

  describe('notEmpty()', () => {
    beforeEach(() => {
      builder.notEmpty();
    });

    it('errors if value is empty', () => {
      expect(() => {
        runChecks(builder, []);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if not empty', () => {
      expect(() => {
        runChecks(builder, ['123']);
      }).not.toThrow();
    });
  });

  describe('sizeOf()', () => {
    beforeEach(() => {
      builder.sizeOf(3);
    });

    it('errors if length doesnt match', () => {
      expect(() => {
        runChecks(builder, []);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if length matches', () => {
      expect(() => {
        runChecks(builder, ['1', '2', '3']);
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
