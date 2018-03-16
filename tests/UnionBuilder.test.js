import { union } from '../src/UnionBuilder';
import { bool, custom } from '../src/Builder';
import { array, object } from '../src/CollectionBuilder';
import { instance } from '../src/InstanceBuilder';
import { number } from '../src/NumberBuilder';
import { shape } from '../src/ShapeBuilder';
import { string } from '../src/StringBuilder';

describe('UnionBuilder', () => {
  let builder;

  class Foo {}
  class Bar {}

  beforeEach(() => {
    builder = union([
      array(string()),
      bool(true).only(),
      instance(Foo),
      number().between(0, 5),
      object(number()),
      string('foo').oneOf(['foo', 'bar', 'baz']),
    ]);
  });

  describe('constructor()', () => {
    it('errors if a non-array is not passed', () => {
      expect(() => {
        union('foo');
      }).toThrowError('A non-empty array of blueprints are required for a union.');
    });

    it('errors if an empty array is passed', () => {
      expect(() => {
        union([]);
      }).toThrowError('A non-empty array of blueprints are required for a union.');
    });

    it('errors if an array with non-builders is passed', () => {
      expect(() => {
        union([123]);
      }).toThrowError('A non-empty array of blueprints are required for a union.');
    });

    it('doesnt error if a builder array is passed', () => {
      expect(() => {
        union([string()]);
      }).not.toThrowError('A non-empty array of blueprints are required for a union.');
    });

    it('sets default value', () => {
      expect(union([string()], 'bar').defaultValue).toBe('bar');
    });
  });

  describe('runChecks()', () => {
    it('errors if a unsupported type is used', () => {
      expect(() => {
        union([string(), number(), bool()]).runChecks('key', []);
      }).toThrowError('Invalid option "key". Type must be one of: String, Number, Boolean');
    });

    it('errors if a nested union is used', () => {
      expect(() => {
        union([string('foo').oneOf(['foo', 'bar', 'baz']), union([number(), bool()])]).runChecks(
          'key',
          [],
        );
      }).toThrowError('Nested unions are not supported.');
    });

    it('errors if an object and shape are used', () => {
      expect(() => {
        union([
          object(string()),
          shape({
            foo: string(),
            bar: number(),
          }),
        ]).runChecks('key', []);
      }).toThrowError('Objects and shapes within the same union are not supported.');
    });

    it('errors if the same builder type is used multiple times', () => {
      expect(() => {
        union([object(string()), object(number())]).runChecks('key', []);
      }).toThrowError('Multiple instances of "object" are not supported.');
    });

    it('errors with the class name for instance checks', () => {
      expect(() => {
        union([number(), instance(FormData)]).runChecks('key', {});
      }).toThrowError('Invalid option "key". Type must be one of: Number, FormData');
    });

    it('runs array check', () => {
      expect(() => {
        builder.runChecks('key', [123]);
      }).toThrowError('Invalid option "key[0]". Must be a string.');
    });

    it('runs boolean check', () => {
      expect(() => {
        builder.runChecks('key', false);
      }).toThrowError('Invalid option "key". Value may only be "true".');
    });

    it('runs custom check', () => {
      expect(() => {
        union([
          string(),
          custom(value => {
            if (typeof value === 'number') {
              throw new TypeError('Encountered a number!');
            }
          }),
        ]).runChecks('key', 123);
      }).toThrowError('Invalid option "key". Encountered a number!');
    });

    it('runs instance check', () => {
      expect(() => {
        builder.runChecks('key', new Bar());
      }).toThrowError('Invalid option "key". Must be an instance of "Foo".');
    });

    it('runs number check', () => {
      expect(() => {
        builder.runChecks('key', 10);
      }).toThrowError('Invalid option "key". Number must be between 0 and 5.');
    });

    it('runs object check', () => {
      expect(() => {
        builder.runChecks('key', { foo: 'foo' });
      }).toThrowError('Invalid option "key.foo". Must be a number.');
    });

    it('runs shape check', () => {
      expect(() => {
        union([
          shape({
            foo: string(),
            bar: number(),
          }),
        ]).runChecks('key', {
          foo: 123,
        });
      }).toThrowError('Invalid option "key.foo". Must be a string.');
    });

    it('runs string check', () => {
      expect(() => {
        builder.runChecks('key', 'qux');
      }).toThrowError('Invalid option "key". String must be one of: foo, bar, baz');
    });

    it('runs correctly for valid values', () => {
      expect(builder.runChecks('key', 'foo')).toBe('foo');
      expect(builder.runChecks('key', 3)).toBe(3);
      expect(builder.runChecks('key', true)).toBe(true);
    });
  });

  describe('typeAlias()', () => {
    it('returns all the available type aliases separated by pipes', () => {
      expect(union([string(), number(), bool()]).typeAlias()).toBe('String | Number | Boolean');
    });

    it('supports complex structures', () => {
      expect(builder.typeAlias()).toBe(
        'Array<String> | Boolean | Foo | Number | Object<Number> | String',
      );
    });
  });
});
