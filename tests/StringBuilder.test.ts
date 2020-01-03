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
      expect(runChecks(string('abc'))).toEqual('abc');
    });

    it('returns default value from factory if value is undefined', () => {
      expect(runChecks(string(() => 'XYZ'))).toEqual('XYZ');
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
          ).toBe('123');
        }),
      );
    });
  });

  describe('camelCase()', () => {
    it('errors if less than 2 characters', () => {
      expect(() => {
        builder.camelCase();
        runChecks(builder, 'a');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if starts with a number', () => {
      expect(() => {
        builder.camelCase();
        runChecks(builder, '1');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in kebab case', () => {
      expect(() => {
        builder.camelCase();
        runChecks(builder, kebabCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in pascal case', () => {
      expect(() => {
        builder.camelCase();
        runChecks(builder, pascalCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in snake case', () => {
      expect(() => {
        builder.camelCase();
        runChecks(builder, snakeCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if in camel case', () => {
      expect(() => {
        builder.camelCase();
        runChecks(builder, camelCase);
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
        runChecks(builder, 'a');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if starts with a number', () => {
      expect(() => {
        builder.kebabCase();
        runChecks(builder, '1');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in camel case', () => {
      expect(() => {
        builder.kebabCase();
        runChecks(builder, camelCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in pascal case', () => {
      expect(() => {
        builder.kebabCase();
        runChecks(builder, pascalCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in snake case', () => {
      expect(() => {
        builder.kebabCase();
        runChecks(builder, snakeCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if in kebab case', () => {
      expect(() => {
        builder.kebabCase();
        runChecks(builder, kebabCase);
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
        runChecks(builder, 'A');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if starts with a number', () => {
      expect(() => {
        builder.pascalCase();
        runChecks(builder, '1');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in camel case', () => {
      expect(() => {
        builder.pascalCase();
        runChecks(builder, camelCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in kebab case', () => {
      expect(() => {
        builder.pascalCase();
        runChecks(builder, kebabCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in snake case', () => {
      expect(() => {
        builder.pascalCase();
        runChecks(builder, snakeCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if in pascal case', () => {
      expect(() => {
        builder.pascalCase();
        runChecks(builder, pascalCase);
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
        runChecks(builder, 'a');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if starts with a number', () => {
      expect(() => {
        builder.snakeCase();
        runChecks(builder, '1');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in camel case', () => {
      expect(() => {
        builder.snakeCase();
        runChecks(builder, camelCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in kebab case', () => {
      expect(() => {
        builder.snakeCase();
        runChecks(builder, kebabCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in pascal case', () => {
      expect(() => {
        builder.snakeCase();
        runChecks(builder, pascalCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if in snake case', () => {
      expect(() => {
        builder.snakeCase();
        runChecks(builder, snakeCase);
      }).not.toThrow();
    });
  });

  describe('typeAlias()', () => {
    it('returns the type name', () => {
      expect(string().typeAlias()).toBe('string');
    });
  });
});
