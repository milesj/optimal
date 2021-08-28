import { AnySchema, blueprint, number, ObjectSchema, string } from '../../src';
import { runInProd } from '../helpers';

describe('blueprint()', () => {
  let schema: ObjectSchema<Record<string, AnySchema>>;

  beforeEach(() => {
    schema = blueprint({
      foo: string(),
      bar: number(),
    });
  });

  describe('type()', () => {
    it('returns shape type', () => {
      expect(blueprint().type()).toBe(
        'object<shape<{ schema: function, type: function, validate: function }>>',
      );
    });
  });

  describe('validateType()', () => {
    it('errors if a non-object is passed', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.validate(123);
      }).toThrow('Must be a plain object.');
    });

    it('errors if a value is not a schema', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.validate({ foo: 123 });
      }).toThrow('Invalid field "foo". Must be a schema.');
    });

    it('errors if null is passed', () => {
      expect(() => {
        schema.validate(null);
      }).toThrow('Null is not allowed.');
    });

    describe('production', () => {
      it(
        'doesnt error if a non-object is passed',
        runInProd(() => {
          expect(() => {
            // @ts-expect-error Invalid type
            schema.validate(123);
          }).not.toThrow();
        }),
      );
    });
  });
});
