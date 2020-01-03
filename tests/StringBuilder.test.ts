import StringBuilder, { string } from '../src/StringBuilder';
import { runChecks, runInProd } from './helpers';

const camelCase = 'fooBarBaz1';
const kebabCase = 'foo-bar-baz2';
const pascalCase = 'FooBarBaz3';
const snakeCase = 'foo_bar_baz4';

describe('StringBuilder', () => {
  let builder: StringBuilder;

  beforeEach(() => {
    builder = string();
  });

  it('sets default value', () => {
    expect(string('bar').defaultValue).toBe('bar');
  });

  describe('runChecks()', () => {
    it('errors if a non-string value is used', () => {
      expect(() => {
        runChecks(
          builder,
          // @ts-ignore Testing wrong type
          123,
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns default value if value is undefined', () => {
      expect(string('abc').runChecks('key', undefined, { key: undefined })).toEqual('abc');
    });

    it('returns default value from factory if value is undefined', () => {
      expect(
        string(() => 'XYZ').runChecks('key', undefined, {
          key: undefined,
        }),
      ).toEqual('XYZ');
    });

    describe('production', () => {
      it(
        'returns default value if value is undefined',
        runInProd(() => {
          expect(runChecks(string('foo'))).toBe('foo');
        }),
      );

      it(
        'returns default value from factory if value is undefined',
        runInProd(() => {
          expect(runChecks(string(() => 'bar'))).toBe('bar');
        }),
      );

      it(
        'bypasses checks and returns value',
        runInProd(() => {
          expect(
            runChecks(
              builder,
              // @ts-ignore Test invalid type
              123,
            ),
          ).toBe(123);
        }),
      );
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
    beforeEach(() => {
      builder.contains('oo');
    });

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

    it('errors if value does not contain token', () => {
      expect(() => {
        runChecks(builder, 'bar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value matches default value and builder is required', () => {
      expect(() => {
        builder.required();

        runChecks(builder, '');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value matches default value and builder is optional', () => {
      expect(() => {
        runChecks(builder, '');
      }).not.toThrow();
    });

    it('doesnt error if value contains token', () => {
      expect(() => {
        runChecks(builder, 'foo');
      }).not.toThrow();
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
    beforeEach(() => {
      builder.match(/oo/u);
    });

    it('errors if pattern is not a regex', () => {
      expect(() => {
        // @ts-ignore Testing wrong type
        builder.match(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value does not match pattern', () => {
      expect(() => {
        runChecks(builder, 'bar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value matches default value and builder is required', () => {
      expect(() => {
        builder.required();

        runChecks(builder, '');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value matches default value and builder is optional', () => {
      expect(() => {
        runChecks(builder, '');
      }).not.toThrow();
    });

    it('doesnt error if value matches pattern', () => {
      expect(() => {
        runChecks(builder, 'foo');
      }).not.toThrow();
    });
  });

  describe('notEmpty()', () => {
    beforeEach(() => {
      builder.notEmpty();
    });

    it('errors if value is empty', () => {
      expect(() => {
        runChecks(builder, '');
      }).toThrowErrorMatchingSnapshot();
    });

    it('deosnt error if value is not empty', () => {
      expect(() => {
        runChecks(builder, 'foo');
      }).not.toThrow();
    });
  });

  describe('oneOf()', () => {
    beforeEach(() => {
      builder.oneOf(['foo', 'bar', 'baz']);
    });

    it('errors if not an array', () => {
      expect(() => {
        builder.oneOf(
          // @ts-ignore Testing wrong type
          123,
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if array is empty', () => {
      expect(() => {
        builder.oneOf([]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if array contains a non-string', () => {
      expect(() => {
        builder.oneOf([
          'foo',
          // @ts-ignore Testing wrong type
          123,
        ]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is not in the list', () => {
      expect(() => {
        runChecks(builder, 'qux');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value contains token', () => {
      expect(() => {
        runChecks(builder, 'foo');
      }).not.toThrow();
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
    beforeEach(() => {
      builder.sizeOf(3);
    });

    it('errors if length doesnt match', () => {
      expect(() => {
        runChecks(builder, '');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if length matches', () => {
      expect(() => {
        runChecks(builder, 'abc');
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
