import UnionBuilder, { union } from '../src/UnionBuilder';
import { bool, custom } from '../src/Builder';
import { array } from '../src/ArrayBuilder';
import { object } from '../src/ObjectBuilder';
import { instance } from '../src/InstanceBuilder';
import { number } from '../src/NumberBuilder';
import { shape } from '../src/ShapeBuilder';
import { string } from '../src/StringBuilder';

describe('UnionBuilder', () => {
  let builder: UnionBuilder;

  class Foo {}
  class Bar {}

  beforeEach(() => {
    builder = union(
      [
        array(string()),
        bool(true).only(),
        instance(Foo),
        number().between(0, 5),
        object(number()),
        string('foo').oneOf(['foo', 'bar', 'baz']),
      ],
      '',
    );
  });

  describe('constructor()', () => {
    it('errors if a non-array is not passed', () => {
      expect(() => {
        // @ts-ignore
        union('foo', []);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if an empty array is passed', () => {
      expect(() => {
        union([], []);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if an array with non-builders is passed', () => {
      expect(() => {
        // @ts-ignore
        union([123], []);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if a builder array is passed', () => {
      expect(() => {
        union([string()], []);
      }).not.toThrowError('A non-empty array of blueprints are required for a union.');
    });

    it('sets default value', () => {
      expect(union([string()], 'bar').defaultValue).toBe('bar');
    });
  });

  describe('runChecks()', () => {
    it('errors if a unsupported type is used', () => {
      expect(() => {
        union([string(), number(), bool()], []).runChecks('key', [], {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if a nested union is used', () => {
      expect(() => {
        union(
          [string('foo').oneOf(['foo', 'bar', 'baz']), union([number(), bool()], [])],
          [],
        ).runChecks('key', '', {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors with the class name for instance checks', () => {
      expect(() => {
        union([number(), instance(Buffer)], {}).runChecks('key', {}, {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs array check', () => {
      expect(() => {
        builder.runChecks('key', [123], {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs boolean check', () => {
      expect(() => {
        builder.runChecks('key', false, {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs custom check', () => {
      expect(() => {
        union(
          [
            string(),
            custom(value => {
              if (typeof value === 'number') {
                throw new TypeError('Encountered a number!');
              }
            }, ''),
          ],
          0,
        ).runChecks('key', 123, {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs instance check', () => {
      expect(() => {
        builder.runChecks('key', new Bar(), {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs number check', () => {
      expect(() => {
        builder.runChecks('key', 10, {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs object check', () => {
      expect(() => {
        builder.runChecks('key', { foo: 'foo' }, {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs shape check', () => {
      expect(() => {
        union(
          [
            shape({
              foo: string(),
              bar: number(),
            }),
          ],
          {},
        ).runChecks(
          'key',
          {
            foo: 123,
          },
          {},
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs string check', () => {
      expect(() => {
        builder.runChecks('key', 'qux', {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs correctly for valid values', () => {
      expect(builder.runChecks('key', 'foo', {})).toBe('foo');
      expect(builder.runChecks('key', 3, {})).toBe(3);
      expect(builder.runChecks('key', true, {})).toBe(true);
    });

    it('supports multiple array builders', () => {
      builder = union([array(string()), array(number())], []);

      expect(() => {
        builder.runChecks('key', [true], {});
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        builder.runChecks('key', [123], {});
      }).not.toThrowError();

      expect(() => {
        builder.runChecks('key', ['abc'], {});
      }).not.toThrowError();
    });

    it('supports multiple object builders', () => {
      builder = union([object(string()), object(number())], {});

      expect(() => {
        builder.runChecks('key', { foo: true }, {});
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        builder.runChecks('key', { foo: 123 }, {});
      }).not.toThrowError();

      expect(() => {
        builder.runChecks('key', { foo: 'abc' }, {});
      }).not.toThrowError();
    });

    it('supports object and shape builders in parallel', () => {
      builder = union(
        [
          shape({
            foo: string(),
            bar: number(),
            baz: bool(),
          }).exact(),
          object(string()),
        ],
        {},
      );

      expect(() => {
        builder.runChecks('key', { unknown: true }, {});
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        builder.runChecks('key', { foo: 123 }, {});
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        builder.runChecks('key', { foo: 'abc', bar: 'abc', baz: 123 }, {});
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        builder.runChecks('key', { foo: 'abc', bar: 123 }, {});
      }).not.toThrowError();

      expect(() => {
        builder.runChecks('key', { key: 'value' }, {});
      }).not.toThrowError();
    });
  });

  describe('typeAlias()', () => {
    it('returns all the available type aliases separated by pipes', () => {
      expect(union([string(), number(), bool()], []).typeAlias()).toBe('string | number | boolean');
    });

    it('supports complex structures', () => {
      expect(builder.typeAlias()).toBe(
        'array<string> | boolean | Foo | number | object<number> | string',
      );
    });
  });
});
