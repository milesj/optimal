import { ShapeSchema, schema as schemaFunc, AnySchema } from '../../src';
import { runInProd } from '../helpers';

describe('schema()', () => {
  let schema: ShapeSchema<AnySchema>;

  beforeEach(() => {
    schema = schemaFunc();
  });

  describe('type()', () => {
    it('returns shape type', () => {
      expect(schemaFunc().type()).toBe('shape<{ type: function, validate: function }>');
    });
  });

  describe('validateType()', () => {
    it('errors if a non-object is passed', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.validate(123);
      }).toThrow('Must be a schema.');
    });

    it('errors if no fields provided', () => {
      expect(() => {
        schema.validate({});
      }).toThrow('Invalid field "type". Field is required and must be defined.');
    });

    it('errors if a type is not a function', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.validate({ type: 123 });
      }).toThrow('Invalid field "type". Must be a function.');
    });

    it('errors if a validate is not a function', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.validate({ type() {}, validate: 123 });
      }).toThrow('Invalid field "validate". Must be a function.');
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
