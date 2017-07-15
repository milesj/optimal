import UnionBuilder, { union } from '../src/UnionBuilder';
import { bool } from '../src/Builder';
import { array, object } from '../src/CollectionBuilder';
import { instance } from '../src/InstanceBuilder';
import { number } from '../src/NumberBuilder';
import { shape } from '../src/ShapeBuilder';
import { string } from '../src/StringBuilder';

class Foo {}
class Bar {}

describe('UnionBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new UnionBuilder([
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
        builder = new UnionBuilder('foo');
      }).toThrowError('A non-empty array of blueprints are required for a union.');
    });

    it('errors if an empty array is passed', () => {
      expect(() => {
        builder = new UnionBuilder([]);
      }).toThrowError('A non-empty array of blueprints are required for a union.');
    });

    it('errors if an array with non-builders is passed', () => {
      expect(() => {
        builder = new UnionBuilder([123]);
      }).toThrowError('A non-empty array of blueprints are required for a union.');
    });

    it('doesnt error if a builder array is passed', () => {
      expect(() => {
        builder = new UnionBuilder([string()]);
      }).not.toThrowError('A non-empty array of blueprints are required for a union.');
    });

    it('sets default value', () => {
      builder = new UnionBuilder([string()], 'bar');

      expect(builder.defaultValue).toBe('bar');
    });
  });

  describe('runChecks()', () => {
    it('errors if a unsupported type is used', () => {
      expect(() => {
        builder = new UnionBuilder([
          string(),
          number(),
          bool(),
        ]);
        builder.runChecks('key', []);
      }).toThrowError('Invalid option "key". Type must be one of: string, number, boolean');
    });

    it('errors if a nested union is used', () => {
      expect(() => {
        builder = new UnionBuilder([
          string('foo').oneOf(['foo', 'bar', 'baz']),
          union([
            number(),
            bool(),
          ]),
        ]);
        builder.runChecks('key', []);
      }).toThrowError('Nested unions are not supported.');
    });

    it('errors if an object and shape are used', () => {
      expect(() => {
        builder = new UnionBuilder([
          object(string()),
          shape({
            foo: string(),
            bar: number(),
          }),
        ]);
        builder.runChecks('key', []);
      }).toThrowError('Objects and shapes within the same union are not supported.');
    });

    it('errors if the same builder type is used multiple times', () => {
      expect(() => {
        builder = new UnionBuilder([
          object(string()),
          object(number()),
        ]);
        builder.runChecks('key', []);
      }).toThrowError('Multiple instances of "object" are not supported.');
    });

    it('errors with the class name for instance checks', () => {
      expect(() => {
        builder = new UnionBuilder([
          number(),
          instance(FormData),
        ]);
        builder.runChecks('key', {});
      }).toThrowError('Invalid option "key". Type must be one of: number, FormData');
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
        builder = new UnionBuilder([
          shape({
            foo: string(),
            bar: number(),
          }),
        ]);
        builder.runChecks('key', {
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
});

describe('union()', () => {
  it('returns a builder', () => {
    expect(union([
      string(),
    ])).toBeInstanceOf(UnionBuilder);
  });

  it('sets default value', () => {
    const builder = union([string()], 'bar');

    expect(builder.defaultValue).toBe('bar');
  });
});
