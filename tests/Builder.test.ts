import Builder, { custom, func } from '../src/Builder';
import { runChecks } from './helpers';

describe('Builder', () => {
  let builder: Builder<unknown>;

  beforeEach(() => {
    builder = new Builder('string', 'foo');
  });

  it('errors if default value is undefined', () => {
    expect(() => {
      builder = new Builder('string', undefined);
    }).toThrowErrorMatchingSnapshot();
  });

  it('sets the type and default value', () => {
    expect(builder.type).toBe('string');
    expect(builder.defaultValue).toBe('foo');
  });

  describe('and()', () => {
    beforeEach(() => {
      builder.and('bar', 'baz');
    });

    it('errors if no keys are defined', () => {
      expect(() => {
        builder.and();
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if not all options are defined', () => {
      expect(() => {
        runChecks(builder, 'a', {
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
        runChecks(builder, 'a', {
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
        builder.type = 'array';

        expect(() => {
          runChecks(builder, []);
        }).not.toThrow();
      });

      it('errors on non-arrays', () => {
        builder.type = 'array';

        expect(() => {
          runChecks(builder, 123);
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('boolean', () => {
      it('allows booleans', () => {
        builder.type = 'boolean';

        expect(() => {
          runChecks(builder, true);
        }).not.toThrow();
      });

      it('errors on non-booleans', () => {
        builder.type = 'boolean';

        expect(() => {
          runChecks(builder, 123);
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('function', () => {
      it('allows functions', () => {
        builder.type = 'function';

        expect(() => {
          runChecks(builder, () => {});
        }).not.toThrow();
      });

      it('errors on non-functions', () => {
        builder.type = 'function';

        expect(() => {
          runChecks(builder, 'foo');
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('number', () => {
      it('allows numbers', () => {
        builder.type = 'number';

        expect(() => {
          runChecks(builder, 123);
        }).not.toThrow();
      });

      it('errors on non-numbers', () => {
        builder.type = 'number';

        expect(() => {
          runChecks(builder, 'foo');
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('object', () => {
      it('allows objects', () => {
        builder.type = 'object';

        expect(() => {
          runChecks(builder, {});
        }).not.toThrow();
      });

      it('errors on non-objects', () => {
        builder.type = 'object';

        expect(() => {
          runChecks(builder, 123);
        }).toThrowErrorMatchingSnapshot();
      });

      it('errors on arrays', () => {
        builder.type = 'object';

        expect(() => {
          runChecks(builder, []);
        }).toThrowErrorMatchingSnapshot();
      });

      it('errors on nulls', () => {
        builder.type = 'object';

        expect(() => {
          runChecks(builder, null);
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('string', () => {
      it('allows strings', () => {
        builder.type = 'string';

        expect(() => {
          runChecks(builder, 'foo');
        }).not.toThrow();
      });

      it('errors on non-strings', () => {
        builder.type = 'string';

        expect(() => {
          runChecks(builder, 123);
        }).toThrowErrorMatchingSnapshot();
      });
    });
  });

  describe('custom()', () => {
    it('errors if no callback', () => {
      // @ts-ignore
      expect(() => builder.custom()).toThrow('Custom blueprints require a validation function.');
    });

    it('errors if callback is not a function', () => {
      // @ts-ignore
      expect(() => builder.custom(123)).toThrow('Custom blueprints require a validation function.');
    });

    it('triggers callback function', () => {
      builder = custom(value => {
        if (value === 123) {
          throw new Error('This will error!');
        }
      }, 0);

      expect(() => {
        runChecks(builder, 123);
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        runChecks(builder, 456);
      }).not.toThrow();
    });

    it('is passed entire options object', () => {
      builder = custom<unknown, { foo?: number; bar?: number }>((value, options) => {
        if (options.foo && options.bar) {
          throw new Error('This will error!');
        }
      }, 0);

      expect(() => {
        builder.runChecks('error', 123, { foo: 123, bar: 456, error: '' });
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('invariant()', () => {
    it('does nothing if condition is true', () => {
      expect(() => {
        builder.invariant(true, '');
      }).not.toThrow();
    });

    it('errors if condition is false', () => {
      expect(() => {
        builder.invariant(false, 'Failure');
      }).toThrowErrorMatchingSnapshot();
    });

    it('includes an option path', () => {
      expect(() => {
        builder.invariant(false, 'Failure', 'foo.bar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('includes a class name', () => {
      expect(() => {
        // @ts-ignore Allow access
        builder.options.name = 'FooBar';

        builder.invariant(false, 'Failure', 'foo.bar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('includes a class name when no path', () => {
      expect(() => {
        // @ts-ignore Allow access
        builder.options.name = 'FooBar';

        builder.invariant(false, 'Failure');
      }).toThrowErrorMatchingSnapshot();
    });

    it('includes a file name', () => {
      expect(() => {
        // @ts-ignore Allow access
        builder.options.file = 'package.json';

        builder.invariant(false, 'Failure', 'foo.bar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('includes a file and class name', () => {
      expect(() => {
        // @ts-ignore Allow access
        builder.options.file = 'package.json';
        // @ts-ignore Allow access
        builder.options.name = 'FooBar';

        builder.invariant(false, 'Failure', 'foo.bar');
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('key()', () => {
    it('returns as-is if not deep', () => {
      // @ts-ignore Allow access
      expect(builder.key('foo')).toBe('foo');
    });

    it('returns last part of a deep path', () => {
      // @ts-ignore Allow access
      expect(builder.key('foo.bar.baz')).toBe('baz');
    });
  });

  describe('message()', () => {
    it('errors for empty value', () => {
      expect(() => {
        builder.message('');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors for non-string value', () => {
      expect(() => {
        // @ts-ignore
        builder.message(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('sets message', () => {
      builder.message('foobar');

      // @ts-ignore Allow access
      expect(builder.errorMessage).toBe('foobar');
    });
  });

  describe('deprecate()', () => {
    it('errors for empty value', () => {
      expect(() => {
        builder.deprecate('');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors for non-string value', () => {
      expect(() => {
        // @ts-ignore
        builder.deprecate(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('sets message', () => {
      builder.deprecate('foobar');

      // @ts-ignore Allow access
      expect(builder.deprecatedMessage).toBe('foobar');
    });
  });

  describe('nullable()', () => {
    it('errors if field is undefined', () => {
      expect(() => {
        builder.notNullable();

        runChecks(builder, null);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if field is defined', () => {
      expect(() => {
        builder.nullable();

        runChecks(builder, null);
      }).not.toThrow();
    });
  });

  describe('required()', () => {
    it('errors if field is undefined', () => {
      expect(() => {
        builder.required();

        runChecks(builder);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if field is defined', () => {
      expect(() => {
        builder.required(false);

        runChecks(builder, 'foo');
      }).not.toThrow();
    });
  });

  describe('runChecks()', () => {
    it('returns valid value', () => {
      expect(builder.runChecks('key', 'bar', {})).toBe('bar');
    });

    it('returns default value if value passed is undefined', () => {
      expect(builder.runChecks('key', undefined, {})).toBe('foo');
    });

    it('returns null if value passed is null and builder is nullable', () => {
      expect(builder.nullable().runChecks('key', null, {})).toBeNull();
    });

    it('errors if value passed is undefined and builder is required', () => {
      expect(() => {
        builder.required().runChecks('key', undefined, {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value passed is null and builder is non-nullable', () => {
      expect(() => {
        builder.runChecks('key', null, {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value passed is defined and builder is never', () => {
      expect(() => {
        // @ts-ignore Allow values
        expect(builder.never().runChecks('key', 'bar', { key: 'bar' })).toBeUndefined();
      }).toThrowErrorMatchingSnapshot();
    });

    it('runs default type of check', () => {
      expect(() => {
        builder.runChecks('key', 123, {});
      }).toThrowErrorMatchingSnapshot();
    });

    it('uses custom message', () => {
      expect(() => {
        builder.message('Oops, something is broken.').runChecks('key', 123, {});
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
        builder.deprecate('Use something else.');
        builder.runChecks('key', 'foo', {});

        expect(console.info).toHaveBeenCalledWith('Field "key" is deprecated. Use something else.');
      });

      it('doesnt log if undefined', () => {
        builder.deprecate('Use something else.');
        builder.runChecks('key', undefined, {});

        expect(console.info).not.toHaveBeenCalledWith(
          'Field "key" is deprecated. Use something else.',
        );
      });
    });
  });

  describe('only()', () => {
    beforeEach(() => {
      builder.only();
    });

    it('errors if default value is not the same type', () => {
      builder.defaultValue = 123;

      expect(() => {
        builder.only();
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value doesnt match the default value', () => {
      expect(() => {
        runChecks(builder, 'bar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value matches default value', () => {
      expect(() => {
        runChecks(builder, 'foo');
      }).not.toThrow();
    });
  });

  describe('or()', () => {
    beforeEach(() => {
      builder.or('bar', 'baz');
    });

    it('errors if no keys are defined', () => {
      expect(() => {
        builder.or();
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if not 1 option is defined', () => {
      expect(() => {
        runChecks(builder, 'a', { key: 'foo', struct: {} });
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if at least 1 option is defined', () => {
      expect(() => {
        runChecks(builder, 'a', { key: 'foo', struct: { foo: 'a' } });
      }).not.toThrow();
    });

    it('doesnt error if at least 1 option is defined that isnt the main field', () => {
      expect(() => {
        runChecks(builder, 'a', { key: 'foo', struct: { bar: 'b' } });
      }).not.toThrow();
    });
  });

  describe('xor()', () => {
    beforeEach(() => {
      builder.xor('bar', 'baz');
    });

    it('errors if no keys are defined', () => {
      expect(() => {
        builder.xor();
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if no options are defined', () => {
      expect(() => {
        runChecks(builder, 'a', { key: 'foo', struct: {} });
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if more than 1 option is defined', () => {
      expect(() => {
        runChecks(builder, 'a', {
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
        runChecks(builder, 'a', {
          key: 'foo',
          struct: {
            foo: 'a',
          },
        });
      }).not.toThrow();
    });
  });
});

describe('custom()', () => {
  it('returns a builder', () => {
    expect(custom(() => {}, '')).toBeInstanceOf(Builder);
  });

  it('sets type and default value', () => {
    const builder = custom(() => {}, 123);

    expect(builder.type).toBe('custom');
    expect(builder.defaultValue).toBe(123);
  });

  it('returns the type alias', () => {
    expect(custom(() => {}, '').typeAlias()).toBe('custom');
  });
});

describe('func()', () => {
  it('returns a builder', () => {
    expect(func()).toBeInstanceOf(Builder);
  });

  it('sets type and default value', () => {
    const noop = () => {};
    const builder = func(noop);

    expect(builder.type).toBe('function');
    expect(builder.defaultValue).toBe(noop);
  });

  it('errors if a non-function value is used', () => {
    expect(() => {
      func().runChecks(
        'key',
        // @ts-ignore Test invalid type
        123,
        {},
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it('returns the type alias', () => {
    expect(func().typeAlias()).toBe('function');
  });
});
