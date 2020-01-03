import TupleBuilder, { tuple } from '../src/TupleBuilder';
import { array } from '../src/ArrayBuilder';
import { bool } from '../src/BooleanBuilder';
import { object } from '../src/ObjectBuilder';
import { number } from '../src/NumberBuilder';
import { string } from '../src/StringBuilder';
import { runChecks } from './helpers';
import { ObjectOf, ArrayOf } from '../src/types';

describe('TupleBuilder', () => {
  type TupleStrings = 'foo' | 'bar' | 'baz';
  type Tuple = [ArrayOf<string>, boolean, number, ObjectOf<number>, TupleStrings];
  let builder: TupleBuilder<Tuple>;

  beforeEach(() => {
    builder = tuple([
      array(string()),
      bool(true),
      number(1).between(0, 5),
      object(number()),
      string('foo').oneOf(['foo', 'bar', 'baz']),
    ]);
  });

  it('errors if a non-array is not passed', () => {
    expect(() => {
      // @ts-ignore
      union('foo', []);
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if an empty array is passed', () => {
    expect(() => {
      tuple(
        // @ts-ignore
        [],
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it('errors if an array with non-builders is passed', () => {
    expect(() => {
      tuple([
        // @ts-ignore
        123,
      ]);
    }).toThrowErrorMatchingSnapshot();
  });

  it('doesnt error if a builder array is passed', () => {
    expect(() => {
      tuple<[string]>([string()]);
    }).not.toThrow();
  });

  describe('runChecks()', () => {
    it('returns an array of default values if undefined provided', () => {
      expect(runChecks(builder)).toEqual([[], true, 1, {}, 'foo']);
    });

    it('returns an array of values if half the tuple was defined', () => {
      expect(runChecks(builder, [['a', 'b', 'c'], false])).toEqual([
        ['a', 'b', 'c'],
        false,
        1,
        {},
        'foo',
      ]);
    });

    it('returns an array of all values if defined', () => {
      expect(runChecks(builder, [['a', 'b', 'c'], false, 3, { a: 1 }, 'bar'])).toEqual([
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
          builder,
          // @ts-ignore Allow extra
          [['a', 'b', 'c'], false, 3, { a: 1 }, 'bar', 'unknown'],
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs checks for array predicate', () => {
      expect(() => {
        runChecks(builder, [
          // @ts-ignore Allow invalid type
          [123],
        ]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs checks for boolean predicate', () => {
      expect(() => {
        runChecks(builder, [
          ['a'],
          // @ts-ignore Allow invalid type
          123,
        ]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs checks for number predicate', () => {
      expect(() => {
        runChecks(builder, [['a'], true, 10]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs checks for object predicate', () => {
      expect(() => {
        runChecks(builder, [
          ['a'],
          true,
          3,
          // @ts-ignore Allow invalid type
          { a: 'a' },
        ]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs checks for string predicate', () => {
      expect(() => {
        runChecks(builder, [
          ['a'],
          true,
          3,
          {},
          // @ts-ignore Allow invalid type
          'qux',
        ]);
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('typeAlias()', () => {
    it('returns the type name', () => {
      expect(builder.typeAlias()).toBe('[array<string>, boolean, number, object<number>, string]');
    });
  });
});
