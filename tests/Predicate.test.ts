import { custom, func, Predicate,Schema, string } from '../src';
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

  describe('and()', () => {
    beforeEach(() => {
      predicate.and('bar', 'baz');
    });

    it('errors if no keys are defined', () => {
      expect(() => {
        predicate.and();
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if not all options are defined', () => {
      expect(() => {
        runChecks(predicate, 'a', {
          key: 'foo',
          struct: {
            foo: 'a',
            baz: 'c',
          },
        });
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if all are defined', () => {
      expect(() => {
        runChecks(predicate, 'a', {
          key: 'foo',
          struct: {
            foo: 'a',
            bar: 'b',
            baz: 'c',
          },
        });
      }).not.toThrow();
    });
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

  describe('custom()', () => {
    it('errors if no callback', () => {
      expect(() =>
        // @ts-expect-error
        predicate.custom(),
      ).toThrow('Custom blueprints require a validation function.');
    });

    it('errors if callback is not a function', () => {
      expect(() =>
        // @ts-expect-error
        predicate.custom(123),
      ).toThrow('Custom blueprints require a validation function.');
    });

    it('triggers callback function', () => {
      predicate = custom((value) => {
        if (value === 123) {
          throw new Error('This will error!');
        }
      }, 0);

      expect(() => {
        runChecks(predicate, 123);
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        runChecks(predicate, 456);
      }).not.toThrow();
    });

    it('is passed entire options object', () => {
      predicate = custom<unknown, { foo?: number; bar?: number }>((value, s) => {
        if (s.struct.foo && s.struct.bar) {
          throw new Error('This will error!');
        }
      }, 0);

      expect(() => {
        runChecks(predicate, 123, {
          struct: { foo: 123, bar: 456, error: '' },
        });
      }).toThrowErrorMatchingSnapshot();
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

  describe('invariant()', () => {
    it('does nothing if condition is true', () => {
      expect(() => {
        predicate.invariant(true, '');
      }).not.toThrow();
    });

    it('errors if condition is false', () => {
      expect(() => {
        predicate.invariant(false, 'Failure');
      }).toThrowErrorMatchingSnapshot();
    });

    it('includes an option path', () => {
      expect(() => {
        predicate.invariant(false, 'Failure', 'foo.bar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('includes a class name', () => {
      expect(() => {
        schema.setName('FooBar');

        predicate.invariant(false, 'Failure', 'foo.bar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('includes a class name when no path', () => {
      expect(() => {
        schema.setName('FooBar');

        predicate.invariant(false, 'Failure');
      }).toThrowErrorMatchingSnapshot();
    });

    it('includes a file name', () => {
      expect(() => {
        schema.setFile('package.json');

        predicate.invariant(false, 'Failure', 'foo.bar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('includes a file and class name', () => {
      expect(() => {
        schema.setName('FooBar').setFile('package.json');

        predicate.invariant(false, 'Failure', 'foo.bar');
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('key()', () => {
    it('returns as-is if not deep', () => {
      // @ts-expect-error Allow access
      expect(predicate.key('foo')).toBe('foo');
    });

    it('returns last part of a deep path', () => {
      // @ts-expect-error Allow access
      expect(predicate.key('foo.bar.baz')).toBe('baz');
    });
  });

  describe('message()', () => {
    it('errors for empty value', () => {
      expect(() => {
        predicate.message('');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors for non-string value', () => {
      expect(() => {
        // @ts-expect-error
        predicate.message(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('sets message', () => {
      predicate.message('foobar');

      // @ts-expect-error Allow access
      expect(predicate.errorMessage).toBe('foobar');
    });
  });

  describe('deprecate()', () => {
    it('errors for empty value', () => {
      expect(() => {
        predicate.deprecate('');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors for non-string value', () => {
      expect(() => {
        // @ts-expect-error
        predicate.deprecate(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('sets message', () => {
      predicate.deprecate('foobar');

      // @ts-expect-error Allow access
      expect(predicate.deprecatedMessage).toBe('foobar');
    });
  });

  describe('nullable()', () => {
    it('errors if field is undefined', () => {
      expect(() => {
        predicate.notNullable();

        runChecks(predicate, null);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if field is defined', () => {
      expect(() => {
        predicate.nullable();

        runChecks(predicate, null);
      }).not.toThrow();
    });
  });

  describe('required()', () => {
    it('errors if field is undefined', () => {
      expect(() => {
        predicate.required();

        runChecks(predicate);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if field is defined', () => {
      expect(() => {
        predicate.required(false);

        runChecks(predicate, 'foo');
      }).not.toThrow();
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

  describe('only()', () => {
    beforeEach(() => {
      predicate.only();
    });

    it('errors if default value is not the same type', () => {
      predicate.defaultValue = 123;

      expect(() => {
        predicate.only();
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value doesnt match the default value', () => {
      expect(() => {
        runChecks(predicate, 'bar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value matches default value', () => {
      expect(() => {
        runChecks(predicate, 'foo');
      }).not.toThrow();
    });
  });

  describe('or()', () => {
    beforeEach(() => {
      predicate.or('bar', 'baz');
    });

    it('errors if no keys are defined', () => {
      expect(() => {
        predicate.or();
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if not 1 option is defined', () => {
      expect(() => {
        runChecks(predicate, 'a', { key: 'foo', struct: {} });
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if at least 1 option is defined', () => {
      expect(() => {
        runChecks(predicate, 'a', { key: 'foo', struct: { foo: 'a' } });
      }).not.toThrow();
    });

    it('doesnt error if at least 1 option is defined that isnt the main field', () => {
      expect(() => {
        runChecks(predicate, 'a', { key: 'foo', struct: { bar: 'b' } });
      }).not.toThrow();
    });
  });

  describe('xor()', () => {
    beforeEach(() => {
      predicate.xor('bar', 'baz');
    });

    it('errors if no keys are defined', () => {
      expect(() => {
        predicate.xor();
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if no options are defined', () => {
      expect(() => {
        runChecks(predicate, 'a', { key: 'foo', struct: {} });
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if more than 1 option is defined', () => {
      expect(() => {
        runChecks(predicate, 'a', {
          key: 'foo',
          struct: {
            foo: 'a',
            bar: 'b',
          },
        });
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if only 1 option is defined', () => {
      expect(() => {
        runChecks(predicate, 'a', {
          key: 'foo',
          struct: {
            foo: 'a',
          },
        });
      }).not.toThrow();
    });
  });

  describe('validate()', () => {
    it('can run the predicate by itself', () => {
      expect(() => {
        func().validate(
          // @ts-expect-error Allow invalid type
          123,
        );
      }).toThrowErrorMatchingSnapshot();
    });
  });
});

describe('custom()', () => {
  it('returns a predicate', () => {
    expect(custom(() => {}, '')).toBeInstanceOf(Predicate);
  });

  it('sets type and default value', () => {
    const predicate = custom(() => {}, 123);

    expect(predicate.type).toBe('custom');
    expect(predicate.defaultValue).toBe(123);
  });

  it('returns the type alias', () => {
    expect(custom(() => {}, '').typeAlias()).toBe('custom');
  });
});

describe('func()', () => {
  it('returns a predicate', () => {
    expect(func()).toBeInstanceOf(Predicate);
  });

  it('sets type and default value', () => {
    const noop = () => {};
    const predicate = func(noop);

    expect(predicate.type).toBe('function');
    expect(predicate.defaultValue).toBe(noop);
  });

  it('returns the type alias', () => {
    expect(func().typeAlias()).toBe('function');
  });
});
