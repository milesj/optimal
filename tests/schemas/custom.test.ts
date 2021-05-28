import { custom, CustomCallback, CustomSchema } from '../../src';
import { runInProd } from '../helpers';
import { runCommonTests } from './runCommonTests';

describe('custom()', () => {
  let schema: CustomSchema<string>;

  const cb: CustomCallback<string> = (value) => {
    if (typeof value !== 'string' && value !== null) {
      throw new TypeError('Must be a string!!!');
    }
  };

  beforeEach(() => {
    schema = custom<string>(cb, 'xyz');
  });

  runCommonTests((defaultValue) => custom<string>(cb, defaultValue), 'abc', {
    defaultValue: 'xyz',
  });

  describe('type()', () => {
    it('returns "custom"', () => {
      expect(custom(cb).type()).toBe('custom');
    });
  });

  describe('validateType()', () => {
    it('errors if a non-function is passed during creation', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        custom(123);
      }).toThrow('Custom requires a validation function.');
    });

    it('doesnt error if a string is passed', () => {
      expect(() => {
        schema.validate('foo');
      }).not.toThrow();
    });

    it('returns passed string', () => {
      expect(schema.validate('foo')).toBe('foo');
    });

    it('returns default value if undefined passed', () => {
      expect(schema.validate(undefined)).toBe('xyz');
    });

    it('errors if null is passed', () => {
      expect(() => {
        schema.validate(null);
      }).toThrow('Null is not allowed.');
    });

    it('errors if a non-string is passed', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.validate(123);
      }).toThrow('Must be a string!!!');
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
