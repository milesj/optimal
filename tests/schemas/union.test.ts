import { array, bool, instance, number, object, string, union, UnionSchema } from '../../src';
import { runInProd } from '../helpers';
import { runCommonTests } from './runCommonTests';

class Foo {}
class Bar {}

describe('union()', () => {
  type UnionStrings = 'bar' | 'baz' | 'foo';
  type Union = Record<string, number> | string[] | UnionStrings | number | true | null;
  let schema: UnionSchema<Union>;

  beforeEach(() => {
    schema = union<Union>(
      [
        array().of(string()),
        bool(true).only(),
        number().between(0, 5),
        object().of(number()),
        string('foo').oneOf(['foo', 'bar', 'baz']),
      ],
      'baz',
    );
  });

  runCommonTests<Union>(
    (defaultValue) =>
      union<Union>(
        [
          array().of(string()),
          bool(true).only(),
          number().between(0, 5),
          object().of(number()),
          string('foo').oneOf(['foo', 'bar', 'baz']),
        ],
        defaultValue!,
      ),
    'baz',
    {
      defaultValue: 1,
    },
  );

  describe('type()', () => {
    it('returns list of types', () => {
      expect(schema.type()).toBe('array<string> | boolean | number | object<number> | string');
    });
  });

  describe('validateType()', () => {
    it('errors if a non-array is passed', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        union(123);
      }).toThrow('A non-empty array of schemas are required for a union.');
    });

    it('errors if an empty array is passed', () => {
      expect(() => {
        union([], '');
      }).toThrow('A non-empty array of schemas are required for a union.');
    });

    it('errors if an invalid value is passed', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.validate('not a whitelisted string');
      })
        .toThrow(`Value must be one of: array<string>, boolean, number, object<number>, string. Received string with the following invalidations:
 - String must be one of: foo, bar, baz`);
    });

    it('doesnt error if a valid value is passed', () => {
      expect(() => {
        schema.validate('foo');
      }).not.toThrow();
    });

    it('returns passed string', () => {
      expect(schema.validate('foo')).toBe('foo');
    });

    it('returns default value if undefined passed', () => {
      expect(schema.validate(undefined)).toBe('baz');
    });

    it('errors if null is passed', () => {
      expect(() => {
        schema.validate(null);
      }).toThrow('Null is not allowed.');
    });

    describe('production', () => {
      it(
        'doesnt error if a non-string is passed',
        runInProd(() => {
          expect(() => {
            // @ts-expect-error Invalid type
            schema.validate('invalid string');
          }).not.toThrow();
        }),
      );
    });
  });
});
