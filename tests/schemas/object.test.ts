import { object, ObjectSchema, string } from '../../src';
import { runInProd } from '../helpers';
import { runCommonTests } from './runCommonTests';

describe('object()', () => {
  let schema: ObjectSchema<Record<string, string>>;

  beforeEach(() => {
    schema = object().of(string());
  });

  runCommonTests<Record<string, string>>(
    (defaultValue) => object(defaultValue),
    { a: 'b' },
    {
      defaultValue: {},
    },
  );

  describe('notEmpty()', () => {
    beforeEach(() => {
      schema.notEmpty();
    });

    it('errors if object is empty', () => {
      expect(() => {
        schema.validate({});
      }).toThrow('Object cannot be empty.');
    });

    it('doesnt error if object is non-empty', () => {
      expect(() => {
        schema.validate({ foo: 'bar' });
      }).not.toThrow();
    });

    describe('production', () => {
      it(
        'errors if object is empty',
        runInProd(() => {
          expect(() => {
            schema.validate({});
          }).not.toThrow();
        }),
      );
    });
  });

  describe('sizeOf()', () => {
    beforeEach(() => {
      schema.sizeOf(1);
    });

    it('errors if a non-number is passed', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.sizeOf('abc');
      }).toThrow('Size of requires a non-zero positive number.');
    });

    it('errors if object has less properties', () => {
      expect(() => {
        schema.validate({});
      }).toThrow('Object must have 1 property.');
    });

    it('errors if object has more properties', () => {
      expect(() => {
        schema.validate({ a: 'a', b: 'b' });
      }).toThrow('Object must have 1 property.');
    });

    it('doesnt error if object has exact properties', () => {
      expect(() => {
        schema.validate({ foo: 'bar' });
      }).not.toThrow();
    });

    describe('production', () => {
      it(
        'errors if object has less properties',
        runInProd(() => {
          expect(() => {
            schema.validate({});
          }).not.toThrow();
        }),
      );
    });
  });

  describe('type()', () => {
    it('returns "object"', () => {
      expect(object().type()).toBe('object');
    });

    it('returns "object" with subtype', () => {
      expect(object().of(string()).type()).toBe('object<string>');
    });
  });

  describe('validateType()', () => {
    it('doesnt error if an object is passed', () => {
      expect(() => {
        schema.validate({ foo: 'bar' });
      }).not.toThrow();
    });

    it('returns passed object', () => {
      expect(schema.validate({ foo: 'bar' })).toEqual({ foo: 'bar' });
    });

    it('returns default value if undefined passed', () => {
      expect(schema.validate(undefined)).toEqual({});
    });

    it('errors if null is passed', () => {
      expect(() => {
        schema.validate(null);
      }).toThrow('Null is not allowed.');
    });

    it('errors if a non-object is passed', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.validate(123);
      }).toThrow('Must be a plain object.');
    });

    it('errors if object value type is invalid', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.validate({ a: 123 });
      }).toThrow('Invalid field ".a". Must be a string.');
    });

    describe('production', () => {
      it(
        'doesnt error if a non-string is passed',
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
