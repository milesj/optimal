import { func, FunctionSchema, UnknownFunction } from '../../src';
import { runInProd } from '../helpers';
import { runCommonTests } from './runCommonTests';

describe('func()', () => {
  let schema: FunctionSchema<UnknownFunction>;
  const noop = () => {};

  beforeEach(() => {
    schema = func();
  });

  runCommonTests(() => func(), noop, { defaultValue: undefined });

  describe('type()', () => {
    it('returns "function"', () => {
      expect(func().type()).toBe('function');
    });
  });

  describe('validateType()', () => {
    it('errors if a non-function is passed', () => {
      expect(() => {
        // @ts-expect-error Invalid type
        schema.validate(123);
      }).toThrow('Must be a function.');
    });

    it('doesnt error if a function is passed', () => {
      expect(() => {
        schema.validate(noop);
      }).not.toThrow();
    });

    it('errors if null is passed', () => {
      expect(() => {
        schema.validate(null);
      }).toThrow('Null is not allowed.');
    });

    describe('production', () => {
      it(
        'doesnt error if a non-function is passed',
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
