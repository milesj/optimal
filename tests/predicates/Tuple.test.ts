import {
  array,
  ArrayOf,
  bool,
  number,
  object,
  ObjectOf,
  string,
  tuple,
  TuplePredicate,
} from '../../src';
import { runChecks, runInProd } from '../helpers';

describe('TuplePredicate', () => {
  type TupleStrings = 'bar' | 'baz' | 'foo';
  type Tuple = [ArrayOf<string>, boolean, number, ObjectOf<number>, TupleStrings];
  let predicate: TuplePredicate<Tuple>;

  beforeEach(() => {
    predicate = tuple([
      array(string()),
      bool(true),
      number(1).between(0, 5),
      object(number()),
      string('foo').oneOf(['foo', 'bar', 'baz']),
    ]);
  });

  it('errors if a non-array is not passed', () => {
    expect(() => {
      // @ts-expect-error
      union('foo', []);
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if an empty array is passed', () => {
    expect(() => {
      tuple(
        // @ts-expect-error
        [],
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if an array with non-predicates is passed', () => {
    expect(() => {
      tuple([
        // @ts-expect-error
        123,
      ]);
    }).toThrowErrorMatchingSnapshot();
  });

  it('doesnt error if a predicate array is passed', () => {
    expect(() => {
      tuple<[string]>([string()]);
    }).not.toThrow();
  });

  describe('default()', () => {
    it('returns the default value', () => {
      expect(predicate.default()).toEqual([[], true, 1, {}, 'foo']);
    });
  });

  describe('run()', () => {
    it('returns an array of default values if undefined provided', () => {
      expect(runChecks(predicate)).toEqual([[], true, 1, {}, 'foo']);
    });

    it('returns an array of values if half the tuple was defined', () => {
      expect(runChecks(predicate, [['a', 'b', 'c'], false])).toEqual([
        ['a', 'b', 'c'],
        false,
        1,
        {},
        'foo',
      ]);
    });

    it('returns an array of all values if defined', () => {
      expect(runChecks(predicate, [['a', 'b', 'c'], false, 3, { a: 1 }, 'bar'])).toEqual([
        ['a', 'b', 'c'],
        false,
        3,
        { a: 1 },
        'bar',
      ]);
    });

    it('errors if too many values defined', () => {
      expect(() => {
        runChecks(
          predicate,
          // @ts-expect-error Allow extra
          [['a', 'b', 'c'], false, 3, { a: 1 }, 'bar', 'unknown'],
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs checks for array predicate', () => {
      expect(() => {
        runChecks(
          predicate,
          // @ts-expect-error Allow invalid type
          [[123]],
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs checks for boolean predicate', () => {
      expect(() => {
        runChecks(
          predicate,
          // @ts-expect-error Allow invalid type
          [['a'], 123],
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs checks for number predicate', () => {
      expect(() => {
        runChecks(predicate, [['a'], true, 10]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs checks for object predicate', () => {
      expect(() => {
        runChecks(
          predicate,
          // @ts-expect-error Allow invalid type
          [['a'], true, 3, { a: 'a' }],
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs checks for string predicate', () => {
      expect(() => {
        runChecks(
          predicate,
          // @ts-expect-error Allow invalid type
          [['a'], true, 3, {}, 'qux'],
        );
      }).toThrowErrorMatchingSnapshot();
    });

    describe('production', () => {
      it(
        'returns default shape if value is empty',
        runInProd(() => {
          expect(runChecks(predicate, [])).toEqual([[], true, 1, {}, 'foo']);
        }),
      );

      it(
        'returns default shape if value is undefined',
        runInProd(() => {
          expect(runChecks(predicate)).toEqual([[], true, 1, {}, 'foo']);
        }),
      );

      it(
        'bypasses checks and returns value',
        runInProd(() => {
          expect(
            runChecks(
              predicate,
              // @ts-expect-error Test invalid type
              [[123], true, 500],
            ),
          ).toEqual([['123'], true, 500, {}, 'foo']);
        }),
      );
    });
  });

  describe('typeAlias()', () => {
    it('returns the type name', () => {
      expect(predicate.typeAlias()).toBe(
        '[array<string>, boolean, number, object<number>, string]',
      );
    });
  });
});
