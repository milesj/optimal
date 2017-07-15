import { shape } from '../src/ShapeBuilder';
import { bool } from '../src/Builder';
import { number } from '../src/NumberBuilder';
import { string } from '../src/StringBuilder';

describe('shape()', () => {
  let builder;

  beforeEach(() => {
    builder = shape({
      foo: string(),
      bar: number(),
      baz: bool(),
    });
  });

  describe('constructor()', () => {
    it('errors if a non-object is not passed', () => {
      expect(() => {
        shape('foo');
      }).toThrowError('A non-empty object of properties to blueprints are required for a shape.');
    });

    it('errors if an empty object is passed', () => {
      expect(() => {
        shape({});
      }).toThrowError('A non-empty object of properties to blueprints are required for a shape.');
    });

    it('errors if an object with non-builders is passed', () => {
      expect(() => {
        shape({ foo: 123 });
      }).toThrowError('A non-empty object of properties to blueprints are required for a shape.');
    });

    it('doesnt error if a builder object is passed', () => {
      expect(() => {
        shape({
          foo: string(),
        });
      }).not.toThrowError('A non-empty object of properties to blueprints are required for a shape.');
    });

    it('sets default value', () => {
      builder = shape({
        foo: string(),
      }, {
        foo: 'bar',
      });

      expect(builder.defaultValue).toEqual({
        foo: 'bar',
      });
    });
  });

  describe('runChecks()', () => {
    it('returns an empty object for no data', () => {
      expect(builder.runChecks('key')).toEqual({});
    });

    it('errors if a non-object is passed', () => {
      expect(() => {
        builder.runChecks('key', 'foo');
      }).toThrowError('Invalid option "key". Must be a plain object.');
    });

    it('checks each item in the object', () => {
      expect(() => {
        builder.runChecks('key', {
          foo: 'foo',
          bar: 'bar',
          baz: true,
        });
      }).toThrowError('Invalid option "key.bar". Must be a number.');
    });

    it('errors if an object item is invalid; persists path with index', () => {
      expect(() => {
        builder.runChecks('key', {
          foo: 123,
        });
      }).toThrowError('Invalid option "key.foo". Must be a string.');
    });

    it('supports shapes of shapes', () => {
      builder = shape({
        foo: shape({
          a: number(),
          b: number(),
          c: string(),
        }),
      });

      const data = {
        foo: {
          a: 123,
          b: 456,
        },
      };

      expect(builder.runChecks('key', data)).toEqual(data);
    });

    it('supports nested required', () => {
      builder = shape({
        foo: string(),
        bar: bool().required(),
      });

      expect(() => {
        builder.runChecks('key', {
          foo: 'abc',
        });
      }).toThrowError('Invalid option "key.bar". Field is required and must be defined.');
    });

    it('errors correctly for shapes in shapes', () => {
      builder = shape({
        foo: shape({
          a: number(),
          b: number(),
          c: string(),
        }),
      });

      expect(() => {
        builder.runChecks('key', {
          foo: {
            a: 123,
            b: 456,
            c: 789,
          },
        });
      }).toThrowError('Invalid option "key.foo.c". Must be a string.');
    });
  });

  describe('typeAlias()', () => {
    it('returns the type name', () => {
      expect(shape({
        a: number(),
        b: number(),
        c: string(),
      }).typeAlias()).toBe('Shape');
    });
  });
});
