import { custom, func, Predicate, Schema, string } from '../src';
import { runChecks } from './helpers';

describe('Predicate', () => {
  let schema: Schema<{}>;
  let predicate: Predicate<unknown>;

  beforeEach(() => {
    schema = new Schema({});
    predicate = new Predicate('string', 'foo');
    predicate.schema = schema;
  });

  it('sets the type and default value', () => {
    expect(predicate.type).toBe('string');
    expect(predicate.defaultValue).toBe('foo');
  });

  describe('checkType()', () => {
    describe('array', () => {
      it('allows arrays', () => {
        predicate.type = 'array';

        expect(() => {
          runChecks(predicate, []);
        }).not.toThrow();
      });

      it('errors on non-arrays', () => {
        predicate.type = 'array';

        expect(() => {
          runChecks(predicate, 123);
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('boolean', () => {
      it('allows booleans', () => {
        predicate.type = 'boolean';

        expect(() => {
          runChecks(predicate, true);
        }).not.toThrow();
      });

      it('errors on non-booleans', () => {
        predicate.type = 'boolean';

        expect(() => {
          runChecks(predicate, 123);
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('function', () => {
      it('allows functions', () => {
        predicate.type = 'function';

        expect(() => {
          runChecks(predicate, () => {});
        }).not.toThrow();
      });

      it('errors on non-functions', () => {
        predicate.type = 'function';

        expect(() => {
          runChecks(predicate, 'foo');
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('number', () => {
      it('allows numbers', () => {
        predicate.type = 'number';

        expect(() => {
          runChecks(predicate, 123);
        }).not.toThrow();
      });

      it('errors on non-numbers', () => {
        predicate.type = 'number';

        expect(() => {
          runChecks(predicate, 'foo');
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('object', () => {
      it('allows objects', () => {
        predicate.type = 'object';

        expect(() => {
          runChecks(predicate, {});
        }).not.toThrow();
      });

      it('errors on non-objects', () => {
        predicate.type = 'object';

        expect(() => {
          runChecks(predicate, 123);
        }).toThrowErrorMatchingSnapshot();
      });

      it('errors on arrays', () => {
        predicate.type = 'object';

        expect(() => {
          runChecks(predicate, []);
        }).toThrowErrorMatchingSnapshot();
      });

      it('errors on nulls', () => {
        predicate.type = 'object';

        expect(() => {
          runChecks(predicate, null);
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('string', () => {
      it('allows strings', () => {
        predicate.type = 'string';

        expect(() => {
          runChecks(predicate, 'foo');
        }).not.toThrow();
      });

      it('errors on non-strings', () => {
        predicate.type = 'string';

        expect(() => {
          runChecks(predicate, 123);
        }).toThrowErrorMatchingSnapshot();
      });
    });
  });

  describe('default()', () => {
    it('returns default value', () => {
      predicate = string('foo');

      expect(predicate.default()).toBe('foo');
    });

    it('returns default value from a factory', () => {
      predicate = string(() => 'bar');

      expect(predicate.default()).toBe('bar');
    });

    it('returns null if nullable', () => {
      predicate = string(null).nullable();

      expect(predicate.default()).toBeNull();
    });

    it('casts value', () => {
      // @ts-expect-error Allow invalid
      predicate = string(() => 123);

      expect(predicate.default()).toBe('123');
    });
  });

  describe('run()', () => {
    it('returns valid value', () => {
      expect(runChecks(predicate, 'bar')).toBe('bar');
    });

    it('returns default value if value passed is undefined', () => {
      expect(runChecks(predicate)).toBe('foo');
    });

    it('returns null if value passed is null and predicate is nullable', () => {
      predicate.nullable();

      expect(runChecks(predicate, null)).toBeNull();
    });

    it('errors if value passed is undefined and predicate is required', () => {
      predicate.required();

      expect(() => {
        runChecks(predicate);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value passed is null and predicate is non-nullable', () => {
      expect(() => {
        runChecks(predicate, null);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value passed is defined and predicate is never', () => {
      predicate.never();

      expect(() => {
        expect(runChecks(predicate, 'bar')).toBeUndefined();
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs default type of check', () => {
      expect(() => {
        runChecks(predicate, 123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('uses custom message', () => {
      predicate.message('Oops, something is broken.');

      expect(() => {
        runChecks(predicate, 123);
      }).toThrowErrorMatchingSnapshot();
    });

    describe('deprecation', () => {
      const oldInfo = console.info;

      beforeEach(() => {
        jest.spyOn(console, 'info').mockImplementation();
      });

      afterEach(() => {
        console.info = oldInfo;
      });

      it('logs a message', () => {
        predicate.deprecate('Use something else.');
        runChecks(predicate, 'foo');

        expect(console.info).toHaveBeenCalledWith('Field "key" is deprecated. Use something else.');
      });

      it('doesnt log if undefined', () => {
        predicate.deprecate('Use something else.');
        runChecks(predicate);

        expect(console.info).not.toHaveBeenCalledWith(
          'Field "key" is deprecated. Use something else.',
        );
      });
    });
  });
});
