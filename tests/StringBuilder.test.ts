import StringBuilder, { string } from '../src/StringBuilder';

const camelCase = 'fooBarBaz1';
const kebabCase = 'foo-bar-baz2';
const pascalCase = 'FooBarBaz3';
const snakeCase = 'foo_bar_baz4';

describe('StringBuilder', () => {
  let builder: StringBuilder;

  beforeEach(() => {
    builder = string();
  });

  describe('constructor()', () => {
    it('sets default value', () => {
      expect(string('bar').defaultValue).toBe('bar');
    });
  });

  describe('runChecks()', () => {
    it('errors if a non-string value is used', () => {
      expect(() => {
        // @ts-ignore Testing wrong type
        builder.runChecks('key', 123, { key: 123 });
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('camelCase()', () => {
    it('errors if less than 2 characters', () => {
      expect(() => {
        builder.camelCase();
        builder.runChecks('key', 'a', { key: 'a' });
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if starts with a number', () => {
      expect(() => {
        builder.camelCase();
        builder.runChecks('key', '1', { key: '1' });
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in kebab case', () => {
      expect(() => {
        builder.camelCase();
        builder.runChecks('key', kebabCase, { key: kebabCase });
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in pascal case', () => {
      expect(() => {
        builder.camelCase();
        builder.runChecks('key', pascalCase, { key: pascalCase });
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in snake case', () => {
      expect(() => {
        builder.camelCase();
        builder.runChecks('key', snakeCase, { key: snakeCase });
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if in camel case', () => {
      expect(() => {
        builder.camelCase();
        builder.runChecks('key', camelCase, { key: camelCase });
      }).not.toThrow();
    });
  });

  describe('contains()', () => {
    it('errors if token is not string', () => {
      expect(() => {
        // @ts-ignore Testing wrong type
        builder.contains(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if token is an empty string', () => {
      expect(() => {
        builder.contains('');
      }).toThrowErrorMatchingSnapshot();
    });

    it('adds a checker', () => {
      builder.contains('oo');

      expect(builder.checks[1]).toEqual({
        callback: builder.checkContains,
        args: ['oo', 0],
      });
    });
  });

  describe('checkContains()', () => {
    it('errors if value does not contain token', () => {
      expect(() => {
        builder.checkContains('key', 'bar', 'oo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value matches default value and builder is required', () => {
      expect(() => {
        builder.required().checkContains('key', '', 'oo');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value matches default value and builder is optional', () => {
      expect(() => {
        builder.checkContains('key', '', 'oo');
      }).not.toThrow('Invalid field "key". String does not include "oo".');
    });

    it('doesnt error if value contains token', () => {
      expect(() => {
        builder.checkContains('key', 'foo', 'oo');
      }).not.toThrow('Invalid field "key". String does not include "oo".');
    });
  });

  describe('kebabCase()', () => {
    it('errors if less than 2 characters', () => {
      expect(() => {
        builder.kebabCase();
        builder.runChecks('key', 'a', { key: 'a' });
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if starts with a number', () => {
      expect(() => {
        builder.kebabCase();
        builder.runChecks('key', '1', { key: '1' });
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in camel case', () => {
      expect(() => {
        builder.kebabCase();
        builder.runChecks('key', camelCase, { key: camelCase });
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in pascal case', () => {
      expect(() => {
        builder.kebabCase();
        builder.runChecks('key', pascalCase, { key: pascalCase });
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in snake case', () => {
      expect(() => {
        builder.kebabCase();
        builder.runChecks('key', snakeCase, { key: snakeCase });
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if in kebab case', () => {
      expect(() => {
        builder.kebabCase();
        builder.runChecks('key', kebabCase, { key: kebabCase });
      }).not.toThrow();
    });
  });

  describe('match()', () => {
    it('errors if pattern is not a regex', () => {
      expect(() => {
        // @ts-ignore Testing wrong type
        builder.match(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('adds a checker', () => {
      builder.match(/oo/u);

      expect(builder.checks[1]).toEqual({
        callback: builder.checkMatch,
        args: [/oo/u, ''],
      });
    });
  });

  describe('checkMatch()', () => {
    it('errors if value does not match pattern', () => {
      expect(() => {
        builder.checkMatch('key', 'bar', /oo/u);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value matches default value and builder is required', () => {
      expect(() => {
        builder.required().checkMatch('key', '', /oo/u);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value matches default value and builder is optional', () => {
      expect(() => {
        builder.checkMatch('key', '', /oo/u);
      }).not.toThrow('Invalid field "key". String does not match pattern "oo".');
    });

    it('doesnt error if value matches pattern', () => {
      expect(() => {
        builder.checkMatch('key', 'foo', /oo/u);
      }).not.toThrow('Invalid field "key". String does not match pattern "oo".');
    });
  });

  describe('notEmpty()', () => {
    it('adds a checker', () => {
      builder.notEmpty();

      expect(builder.checks[1]).toEqual({
        callback: builder.checkNotEmpty,
        args: [],
      });
    });
  });

  describe('checkNotEmpty()', () => {
    it('errors if value is empty', () => {
      expect(() => {
        builder.checkNotEmpty('key', '');
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('oneOf()', () => {
    it('errors if not an array', () => {
      expect(() => {
        // @ts-ignore Testing wrong type
        builder.oneOf(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if array is empty', () => {
      expect(() => {
        builder.oneOf([]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if array contains a non-string', () => {
      expect(() => {
        // @ts-ignore Testing wrong type
        builder.oneOf(['foo', 123]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('adds a checker', () => {
      builder.oneOf(['foo', 'bar', 'baz']);

      expect(builder.checks[1]).toEqual({
        callback: builder.checkOneOf,
        args: [['foo', 'bar', 'baz']],
      });
    });
  });

  describe('checkOneOf()', () => {
    it('errors if value is not in the list', () => {
      expect(() => {
        builder.checkOneOf('key', 'qux', ['foo', 'bar', 'baz']);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value contains token', () => {
      expect(() => {
        builder.checkOneOf('key', 'foo', ['foo', 'bar', 'baz']);
      }).not.toThrow('Invalid field "key". String must be one of: foo, bar, baz');
    });
  });

  describe('pascalCase()', () => {
    it('errors if less than 2 characters', () => {
      expect(() => {
        builder.pascalCase();
        builder.runChecks('key', 'A', { key: 'A' });
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if starts with a number', () => {
      expect(() => {
        builder.pascalCase();
        builder.runChecks('key', '1', { key: '1' });
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in camel case', () => {
      expect(() => {
        builder.pascalCase();
        builder.runChecks('key', camelCase, { key: camelCase });
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in kebab case', () => {
      expect(() => {
        builder.pascalCase();
        builder.runChecks('key', kebabCase, { key: kebabCase });
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in snake case', () => {
      expect(() => {
        builder.pascalCase();
        builder.runChecks('key', snakeCase, { key: snakeCase });
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if in pascal case', () => {
      expect(() => {
        builder.pascalCase();
        builder.runChecks('key', pascalCase, { key: pascalCase });
      }).not.toThrow();
    });
  });

  describe('sizeOf()', () => {
    it('adds a checker', () => {
      builder.sizeOf(3);

      expect(builder.checks[1]).toEqual({
        callback: builder.checkSizeOf,
        args: [3],
      });
    });
  });

  describe('checkSizeOf()', () => {
    it('errors if length doesnt match', () => {
      expect(() => {
        builder.checkSizeOf('key', '', 3);
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if length matches', () => {
      expect(() => {
        builder.checkSizeOf('key', 'abc', 3);
      }).not.toThrow();
    });
  });

  describe('snakeCase()', () => {
    it('errors if less than 2 characters', () => {
      expect(() => {
        builder.snakeCase();
        builder.runChecks('key', 'a', { key: 'a' });
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if starts with a number', () => {
      expect(() => {
        builder.snakeCase();
        builder.runChecks('key', '1', { key: '1' });
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in camel case', () => {
      expect(() => {
        builder.snakeCase();
        builder.runChecks('key', camelCase, { key: camelCase });
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in kebab case', () => {
      expect(() => {
        builder.snakeCase();
        builder.runChecks('key', kebabCase, { key: kebabCase });
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in pascal case', () => {
      expect(() => {
        builder.snakeCase();
        builder.runChecks('key', pascalCase, { key: pascalCase });
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if in snake case', () => {
      expect(() => {
        builder.snakeCase();
        builder.runChecks('key', snakeCase, { key: snakeCase });
      }).not.toThrow();
    });
  });

  describe('typeAlias()', () => {
    it('returns the type name', () => {
      expect(string().typeAlias()).toBe('string');
    });
  });
});
