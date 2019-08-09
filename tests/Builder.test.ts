import Builder, { bool, custom, func } from '../src/Builder';

describe('Builder', () => {
  let builder: Builder<unknown>;

  beforeEach(() => {
    builder = new Builder('string', 'foo');
  });

  describe('constructor()', () => {
    it('errors if default value is undefined', () => {
      expect(() => {
        builder = new Builder('string', undefined);
      }).toThrowErrorMatchingSnapshot();
    });

    it('sets the type and default value', () => {
      expect(builder.type).toBe('string');
      expect(builder.defaultValue).toBe('foo');
    });

    it('adds a type of check', () => {
      expect(builder.checks).toEqual([
        {
          callback: builder.checkType,
          args: [],
        },
      ]);
    });
  });

  describe('addCheck()', () => {
    it('enqueues a function with arguments', () => {
      const callback = () => {};

      expect(builder.checks).toHaveLength(1);

      builder.addCheck(callback, 'foo', 'bar', 'baz');

      expect(builder.checks[1]).toEqual({
        args: ['foo', 'bar', 'baz'],
        callback,
      });
    });
  });

  describe('and()', () => {
    it('errors if no keys are defined', () => {
      expect(() => {
        builder.and();
      }).toThrowErrorMatchingSnapshot();
    });

    it('adds a checker', () => {
      builder.and('bar', 'baz');

      expect(builder.checks[1]).toEqual({
        callback: builder.checkAnd,
        args: [['bar', 'baz']],
      });
    });
  });

  describe('checkAnd()', () => {
    it('errors if not all options are defined', () => {
      expect(() => {
        builder.currentStruct = {
          foo: 'a',
          baz: 'c',
        };

        builder.checkAnd('foo', 'a', ['bar', 'baz']);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if all are defined', () => {
      expect(() => {
        builder.currentStruct = {
          foo: 'a',
          bar: 'b',
          baz: 'c',
        };

        builder.checkAnd('foo', 'a', ['bar', 'baz']);
      }).not.toThrowError('Invalid field "foo".');
    });
  });

  describe('checkType()', () => {
    describe('array', () => {
      it('allows arrays', () => {
        builder.type = 'array';

        expect(() => {
          builder.checkType('key', []);
        }).not.toThrowError('Invalid field "key". Must be an array.');
      });

      it('errors on non-arrays', () => {
        builder.type = 'array';

        expect(() => {
          builder.checkType('key', 123);
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('boolean', () => {
      it('allows booleans', () => {
        builder.type = 'boolean';

        expect(() => {
          builder.checkType('key', true);
        }).not.toThrowError('Invalid field "key". Must be a boolean.');
      });

      it('errors on non-booleans', () => {
        builder.type = 'boolean';

        expect(() => {
          builder.checkType('key', 123);
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('function', () => {
      it('allows functions', () => {
        builder.type = 'function';

        expect(() => {
          builder.checkType('key', () => {});
        }).not.toThrowError('Invalid field "key". Must be a function.');
      });

      it('errors on non-functions', () => {
        builder.type = 'function';

        expect(() => {
          builder.checkType('key', 'foo');
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('number', () => {
      it('allows numbers', () => {
        builder.type = 'number';

        expect(() => {
          builder.checkType('key', 123);
        }).not.toThrowError('Invalid field "key". Must be a number.');
      });

      it('errors on non-numbers', () => {
        builder.type = 'number';

        expect(() => {
          builder.checkType('key', 'foo');
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('object', () => {
      it('allows objects', () => {
        builder.type = 'object';

        expect(() => {
          builder.checkType('key', {});
        }).not.toThrowError('Invalid field "key". Must be a plain object.');
      });

      it('errors on non-objects', () => {
        builder.type = 'object';

        expect(() => {
          builder.checkType('key', 123);
        }).toThrowErrorMatchingSnapshot();
      });

      it('errors on arrays', () => {
        builder.type = 'object';

        expect(() => {
          builder.checkType('key', []);
        }).toThrowErrorMatchingSnapshot();
      });

      it('errors on nulls', () => {
        builder.type = 'object';

        expect(() => {
          builder.checkType('key', null);
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('string', () => {
      it('allows strings', () => {
        builder.type = 'string';

        expect(() => {
          builder.checkType('key', 'foo');
        }).not.toThrowError('Invalid field "key". Must be a string.');
      });

      it('errors on non-strings', () => {
        builder.type = 'string';

        expect(() => {
          builder.checkType('key', 123);
        }).toThrowErrorMatchingSnapshot();
      });
    });
  });

  describe('custom()', () => {
    it('errors if no callback', () => {
      // @ts-ignore
      expect(() => builder.custom()).toThrowError(
        'Custom blueprints require a validation function.',
      );
    });

    it('errors if callback is not a function', () => {
      // @ts-ignore
      expect(() => builder.custom(123)).toThrowError(
        'Custom blueprints require a validation function.',
      );
    });
  });

  describe('checkCustom()', () => {
    it('triggers callback function', () => {
      builder = custom(value => {
        if (value === 123) {
          throw new Error('This will error!');
        }
      }, 0);

      expect(() => {
        builder.runChecks('error', 123, {});
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        builder.runChecks('key', 456, {});
      }).not.toThrowError('Invalid field "error". This will error!');
    });

    it('is passed entire options object', () => {
      builder = custom((value, options: { foo?: number; bar?: number }) => {
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
      }).not.toThrowError();
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
        builder.options.name = 'FooBar';

        builder.invariant(false, 'Failure', 'foo.bar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('includes a class name when no path', () => {
      expect(() => {
        builder.options.name = 'FooBar';

        builder.invariant(false, 'Failure');
      }).toThrowErrorMatchingSnapshot();
    });

    it('includes a file name', () => {
      expect(() => {
        builder.options.file = 'package.json';

        builder.invariant(false, 'Failure', 'foo.bar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('includes a file and class name', () => {
      expect(() => {
        builder.options.file = 'package.json';
        builder.options.name = 'FooBar';

        builder.invariant(false, 'Failure', 'foo.bar');
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('key()', () => {
    it('returns as-is if not deep', () => {
      expect(builder.key('foo')).toBe('foo');
    });

    it('returns last part of a deep path', () => {
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

      expect(builder.deprecatedMessage).toBe('foobar');
    });
  });

  describe('nullable()', () => {
    it('toggles nullable state', () => {
      expect(builder.isNullable).toBe(false);

      builder.nullable();

      expect(builder.isNullable).toBe(true);

      builder.notNullable();

      expect(builder.isNullable).toBe(false);
    });
  });

  describe('required()', () => {
    it('toggles required state', () => {
      expect(builder.isRequired).toBe(false);

      builder.required();

      expect(builder.isRequired).toBe(true);

      builder.required(false);

      expect(builder.isRequired).toBe(false);
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
        console.info = jest.fn();
      });

      afterEach(() => {
        console.info = oldInfo;
      });

      it('logs a message', () => {
        builder.deprecate('Use something else.');
        builder.runChecks('key', 'foo', {});

        expect(console.info).toBeCalledWith('Field "key" is deprecated. Use something else.');
      });

      it('doesnt log if undefined', () => {
        builder.deprecate('Use something else.');
        builder.runChecks('key', undefined, {});

        expect(console.info).not.toBeCalledWith('Field "key" is deprecated. Use something else.');
      });
    });
  });

  describe('only()', () => {
    it('errors if default value is not the same type', () => {
      builder.defaultValue = 123;

      expect(() => {
        builder.only();
      }).toThrowErrorMatchingSnapshot();
    });

    it('adds a checker', () => {
      builder.only();

      expect(builder.checks[1]).toEqual({
        callback: builder.checkOnly,
        args: [],
      });
    });
  });

  describe('checkOnly()', () => {
    beforeEach(() => {
      builder.only();
    });

    it('errors if value doesnt match the default value', () => {
      expect(() => {
        builder.checkOnly('key', 'bar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value matches default value', () => {
      expect(() => {
        builder.checkOnly('key', 'foo');
      }).not.toThrowError('Invalid field "key". Value may only be "foo".');
    });
  });

  describe('or()', () => {
    it('errors if no keys are defined', () => {
      expect(() => {
        builder.or();
      }).toThrowErrorMatchingSnapshot();
    });

    it('adds a checker', () => {
      builder.or('bar', 'baz');

      expect(builder.checks[1]).toEqual({
        callback: builder.checkOr,
        args: [['bar', 'baz']],
      });
    });
  });

  describe('checkOr()', () => {
    it('errors if not 1 option is defined', () => {
      expect(() => {
        builder.currentStruct = {};

        builder.checkOr('foo', 'a', ['bar', 'baz']);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if at least 1 option is defined', () => {
      expect(() => {
        builder.currentStruct = {
          foo: 'a',
        };

        builder.checkOr('foo', 'a', ['bar', 'baz']);
      }).not.toThrowError('Invalid field "foo".');
    });

    it('doesnt error if at least 1 option is defined that isnt the main field', () => {
      expect(() => {
        builder.currentStruct = {
          bar: 'b',
        };

        builder.checkOr('foo', 'a', ['bar', 'baz']);
      }).not.toThrowError('Invalid field "foo".');
    });
  });

  describe('xor()', () => {
    it('errors if no keys are defined', () => {
      expect(() => {
        builder.xor();
      }).toThrowErrorMatchingSnapshot();
    });

    it('adds a checker', () => {
      builder.xor('bar', 'baz');

      expect(builder.checks[1]).toEqual({
        callback: builder.checkXor,
        args: [['bar', 'baz']],
      });
    });
  });

  describe('checkXor()', () => {
    it('errors if no options are defined', () => {
      expect(() => {
        builder.currentStruct = {};

        builder.checkXor('foo', 'a', ['bar', 'baz']);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if more than 1 option is defined', () => {
      expect(() => {
        builder.currentStruct = {
          foo: 'a',
          bar: 'b',
        };

        builder.checkXor('foo', 'a', ['bar', 'baz']);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if only 1 option is defined', () => {
      expect(() => {
        builder.currentStruct = {
          foo: 'a',
        };

        builder.checkXor('foo', 'a', ['bar', 'baz']);
      }).not.toThrowError('Invalid field "foo".');
    });
  });
});

describe('bool()', () => {
  it('returns a builder', () => {
    expect(bool(true)).toBeInstanceOf(Builder);
  });

  it('sets type and default value', () => {
    const builder = bool(true);

    expect(builder.type).toBe('boolean');
    expect(builder.defaultValue).toBe(true);
  });

  it('errors if a non-boolean value is used', () => {
    expect(() => {
      bool().runChecks(
        'key',
        // @ts-ignore Test invalid type
        123,
        {},
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it('returns the type alias', () => {
    expect(bool().typeAlias()).toBe('boolean');
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
