import { InstanceSchema, regex } from '../../src';
import { runInProd } from '../helpers';
import { runCommonTests } from './runCommonTests';

describe('regex()', () => {
  let schema: InstanceSchema<RegExp | null>;

  beforeEach(() => {
    schema = regex();
  });

  runCommonTests(() => regex(), /abc/u, { skipNullValues: true });

  describe('type()', () => {
    it('returns "RegExp"', () => {
      expect(regex().type()).toBe('RegExp');
    });
  });

  describe('validateType()', () => {
    it('errors if a non-object is passed', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.validate(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if a plain object is passed', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.validate({});
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if a regex pattern is passed', () => {
      expect(() => {
        schema.validate(/foo/u);
      }).not.toThrow();
    });

    it('doesnt error if null is passed', () => {
      expect(() => {
        schema.validate(null);
      }).not.toThrow();
    });

    describe('production', () => {
      it(
        'doesnt error if a plain object is passed',
        runInProd(() => {
          expect(() => {
            // @ts-expect-error Invalid type
            schema.validate({});
          }).not.toThrow();
        }),
      );
    });
  });
});
