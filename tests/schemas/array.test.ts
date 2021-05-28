import { array, ArraySchema, string } from '../../src';
import { runInProd } from '../helpers';
import { runCommonTests } from './runCommonTests';

describe('array()', () => {
  let schema: ArraySchema<string[]>;

  beforeEach(() => {
    schema = array().of(string());
  });

  runCommonTests((defaultValue) => array<string>(defaultValue), ['a', 'b', 'c'], {
    defaultValue: [],
  });

  describe('type()', () => {
    it('returns "array"', () => {
      expect(array().type()).toBe('array');
    });

    it('returns "array" with subtype', () => {
      expect(array().of(string()).type()).toBe('array<string>');
    });
  });

  describe('validateType()', () => {
    it('doesnt error if an array is passed', () => {
      expect(() => {
        schema.validate(['foo']);
      }).not.toThrow();
    });

    it('returns passed array', () => {
      expect(schema.validate(['a', 'b'])).toEqual(['a', 'b']);
    });

    it('returns default value if undefined passed', () => {
      expect(schema.validate(undefined)).toEqual([]);
    });

    it('errors if null is passed', () => {
      expect(() => {
        schema.validate(null);
      }).toThrow('Null is not allowed.');
    });

    it('errors if a non-array is passed', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.validate(123);
      }).toThrow('Must be an array.');
    });

    it('errors if array value type is invalid', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.validate([123]);
      }).toThrow('Invalid field "[0]". Must be a string.');
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
