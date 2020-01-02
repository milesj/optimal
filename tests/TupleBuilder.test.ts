import TupleBuilder, { tuple } from '../src/TupleBuilder';
import { array } from '../src/ArrayBuilder';
import { bool } from '../src/BooleanBuilder';
import { object } from '../src/ObjectBuilder';
import { number } from '../src/NumberBuilder';
import { string } from '../src/StringBuilder';
import { runChecks } from './helpers';

describe('TupleBuilder', () => {
  type Tuple = [string[], boolean, number, object, string];
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
        runChecks(builder, [['123']]);
      }).not.toThrow();
    });
  });

  describe('typeAlias()', () => {
    it('returns the type name', () => {
      expect(builder.typeAlias()).toBe('[array<string>, boolean, number, object<number>, string]');
    });
  });
});
