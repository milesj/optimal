import Builder from '../src/Builder';

describe('Builder', () => {
  let builder;

  beforeEach(() => {
    builder = new Builder('string', 'foo');
  });

  describe('constructor()', () => {
    it('errors if default value is undefined', () => {
      expect(() => {
        builder = new Builder('string');
      }).toThrowError('A default value for type "string" is required.');
    });

    it('sets the type and default value', () => {
      expect(builder.type).toBe('string');
      expect(builder.defaultValue).toBe('foo');
    });

    it('adds a type of check', () => {
      expect(builder.checks).toEqual([
        {
          func: builder.checkTypeOf,
          args: [],
        },
      ]);
    });
  });

  describe('addCheck()', () => {
    it('enqueues a function with arguments', () => {
      const func = () => {};

      expect(builder.checks).toHaveLength(1);

      builder.addCheck(func, 'foo', 'bar', 'baz');

      expect(builder.checks[1]).toEqual({
        func,
        args: ['foo', 'bar', 'baz'],
      });
    });
  });

  describe('checkTypeOf()', () => {
    describe('array', () => {
      it('allows arrays', () => {
        builder.type = 'array';

        expect(() => {
          builder.checkTypeOf('key', []);
        }).not.toThrowError('Invalid option "key". Must be an array.');
      });

      it('errors on non-arrays', () => {
        builder.type = 'array';

        expect(() => {
          builder.checkTypeOf('key', 123);
        }).toThrowError('Invalid option "key". Must be an array.');
      });
    });

    describe('boolean', () => {
      it('allows booleans', () => {
        builder.type = 'boolean';

        expect(() => {
          builder.checkTypeOf('key', true);
        }).not.toThrowError('Invalid option "key". Must be a boolean.');
      });

      it('errors on non-booleans', () => {
        builder.type = 'boolean';

        expect(() => {
          builder.checkTypeOf('key', 123);
        }).toThrowError('Invalid option "key". Must be a boolean.');
      });
    });

    describe('function', () => {
      it('allows functions', () => {
        builder.type = 'function';

        expect(() => {
          builder.checkTypeOf('key', () => {});
        }).not.toThrowError('Invalid option "key". Must be a function.');
      });

      it('errors on non-functions', () => {
        builder.type = 'function';

        expect(() => {
          builder.checkTypeOf('key', 'foo');
        }).toThrowError('Invalid option "key". Must be a function.');
      });
    });

    describe('number', () => {
      it('allows numbers', () => {
        builder.type = 'number';

        expect(() => {
          builder.checkTypeOf('key', 123);
        }).not.toThrowError('Invalid option "key". Must be a number.');
      });

      it('errors on non-numbers', () => {
        builder.type = 'number';

        expect(() => {
          builder.checkTypeOf('key', 'foo');
        }).toThrowError('Invalid option "key". Must be a number.');
      });
    });

    describe('object', () => {
      it('allows objects', () => {
        builder.type = 'object';

        expect(() => {
          builder.checkTypeOf('key', {});
        }).not.toThrowError('Invalid option "key". Must be a plain object.');
      });

      it('errors on non-objects', () => {
        builder.type = 'object';

        expect(() => {
          builder.checkTypeOf('key', 123);
        }).toThrowError('Invalid option "key". Must be a plain object.');
      });

      it('errors on arrays', () => {
        builder.type = 'object';

        expect(() => {
          builder.checkTypeOf('key', []);
        }).toThrowError('Invalid option "key". Must be a plain object.');
      });

      it('errors on nulls', () => {
        builder.type = 'object';

        expect(() => {
          builder.checkTypeOf('key', null);
        }).toThrowError('Invalid option "key". Must be a plain object.');
      });
    });

    describe('string', () => {
      it('allows strings', () => {
        builder.type = 'string';

        expect(() => {
          builder.checkTypeOf('key', 'foo');
        }).not.toThrowError('Invalid option "key". Must be a string.');
      });

      it('errors on non-strings', () => {
        builder.type = 'string';

        expect(() => {
          builder.checkTypeOf('key', 123);
        }).toThrowError('Invalid option "key". Must be a string.');
      });
    });
  });

  describe('invariant()', () => {
    it('does nothing if condition is true', () => {
      expect(() => {
        builder.invariant(true);
      }).not.toThrowError();
    });

    it('errors if condition is false', () => {
      expect(() => {
        builder.invariant(false, 'Failure');
      }).toThrowError('Failure');
    });

    it('includes an option path', () => {
      expect(() => {
        builder.invariant(false, 'Failure', 'foo.bar');
      }).toThrowError('Invalid option "foo.bar". Failure');
    });

    it('includes a class name', () => {
      expect(() => {
        builder.currentConfig.name = 'FooBar';

        builder.invariant(false, 'Failure', 'foo.bar');
      }).toThrowError('Invalid `FooBar` option "foo.bar". Failure');
    });

    it('includes a class name when no path', () => {
      expect(() => {
        builder.currentConfig.name = 'FooBar';

        builder.invariant(false, 'Failure');
      }).toThrowError('FooBar: Failure');
    });
  });

  describe('message()', () => {
    it('errors for empty value', () => {
      expect(() => {
        builder.message('');
      }).toThrowError('A non-empty string is required for custom messages.');
    });

    it('errors for non-string value', () => {
      expect(() => {
        builder.message(123);
      }).toThrowError('A non-empty string is required for custom messages.');
    });

    it('sets message', () => {
      builder.message('foobar');

      expect(builder.errorMessage).toBe('foobar');
    });
  });

  describe('nullable()', () => {
    it('toggles nullable state', () => {
      expect(builder.isNullable).toBe(false);

      builder.nullable();

      expect(builder.isNullable).toBe(true);

      builder.nullable(false);

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
      expect(builder.runChecks('key', 'bar')).toBe('bar');
    });

    it('returns default value if value passed is undefined', () => {
      expect(builder.runChecks('key')).toBe('foo');
    });

    it('returns null if value passed is null and builder is nullable', () => {
      expect(builder.nullable().runChecks('key', null)).toBe(null);
    });

    it('errors if value passed is undefined and builder is required', () => {
      expect(() => {
        builder.required().runChecks('key');
      }).toThrowError('Invalid option "key". Field is required and must be defined.');
    });

    it('errors if value passed is null and builder is non-nullable', () => {
      expect(() => {
        builder.runChecks('key', null);
      }).toThrowError('Invalid option "key". Null is not allowed.');
    });

    it('runs default type of check', () => {
      expect(() => {
        builder.runChecks('key', 123);
      }).toThrowError('Invalid option "key". Must be a string.');
    });

    it('uses custom message', () => {
      expect(() => {
        builder.message('Oops, something is broken.').runChecks('key', 123);
      }).toThrowError('Invalid option "key". Oops, something is broken.');
    });
  });

  describe('only()', () => {
    it('errors if default value is not the same type', () => {
      builder.defaultValue = 123;

      expect(() => {
        builder.only();
      }).toThrowError('Only requires a default string value.');
    });

    it('adds a checker', () => {
      builder.only();

      expect(builder.checks[1]).toEqual({
        func: builder.checkOnly,
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
      }).toThrowError('Invalid option "key". Value may only be "foo".');
    });

    it('doesnt error if value matches default value', () => {
      expect(() => {
        builder.checkOnly('key', 'foo');
      }).not.toThrowError('Invalid option "key". Value may only be "foo".');
    });
  });
});
