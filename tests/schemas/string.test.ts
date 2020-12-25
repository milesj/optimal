import { string, StringSchema } from '../../src/NEW';
import { runChecks, runInProd } from '../helpers';

const camelCase = 'fooBarBaz1';
const kebabCase = 'foo-bar-baz2';
const pascalCase = 'FooBarBaz3';
const snakeCase = 'foo_bar_baz4';

describe('StringPredicate', () => {
  let schema: StringSchema;

  beforeEach(() => {
    schema = string();
  });

  it('errors if a non-string value is used', () => {
    expect(() => {
      runChecks(
        schema,
        // @ts-expect-error Testing wrong type
        123,
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it('returns the type alias', () => {
    expect(string().type()).toBe('string');
  });

  it('returns default value if value is undefined', () => {
    expect(runChecks(string('abc'))).toEqual('abc');
  });

  // it('returns default value from factory if value is undefined', () => {
  //   expect(runChecks(string(() => 'XYZ'))).toEqual('XYZ');
  // });

  describe('production', () => {
    it(
      'returns default value if value is undefined',
      runInProd(() => {
        expect(runChecks(string('foo'))).toBe('foo');
      }),
    );

    // it(
    //   'returns default value from factory if value is undefined',
    //   runInProd(() => {
    //     expect(runChecks(string(() => 'bar'))).toBe('bar');
    //   }),
    // );

    it(
      'bypasses checks and returns value',
      runInProd(() => {
        expect(
          runChecks(
            schema,
            // @ts-expect-error Test invalid type
            123,
          ),
        ).toBe('123');
      }),
    );
  });

  describe('camelCase()', () => {
    it('errors if less than 2 characters', () => {
      expect(() => {
        schema.camelCase();
        runChecks(schema, 'a');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if starts with a number', () => {
      expect(() => {
        schema.camelCase();
        runChecks(schema, '1');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in kebab case', () => {
      expect(() => {
        schema.camelCase();
        runChecks(schema, kebabCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in pascal case', () => {
      expect(() => {
        schema.camelCase();
        runChecks(schema, pascalCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in snake case', () => {
      expect(() => {
        schema.camelCase();
        runChecks(schema, snakeCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if in camel case', () => {
      expect(() => {
        schema.camelCase();
        runChecks(schema, camelCase);
      }).not.toThrow();
    });

    it('errors if `null`', () => {
      expect(() => {
        runChecks(schema, null);
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns `null` if nullable', () => {
      expect(runChecks(schema.nullable(), null)).toBeNull();
    });
  });

  describe('contains()', () => {
    beforeEach(() => {
      schema.contains('oo');
    });

    it('errors if token is not string', () => {
      expect(() => {
        // @ts-expect-error Testing wrong type
        schema.contains(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if token is an empty string', () => {
      expect(() => {
        schema.contains('');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value does not contain token', () => {
      expect(() => {
        runChecks(schema, 'bar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value matches default value and predicate is required', () => {
      expect(() => {
        schema.required();

        runChecks(schema, '');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value matches default value and predicate is optional', () => {
      expect(() => {
        runChecks(schema, '');
      }).not.toThrow();
    });

    it('doesnt error if value contains token', () => {
      expect(() => {
        runChecks(schema, 'foo');
      }).not.toThrow();
    });

    it('errors if `null`', () => {
      expect(() => {
        runChecks(schema, null);
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns `null` if nullable', () => {
      expect(runChecks(schema.nullable(), null)).toBeNull();
    });
  });

  describe('kebabCase()', () => {
    it('errors if less than 2 characters', () => {
      expect(() => {
        schema.kebabCase();
        runChecks(schema, 'a');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if starts with a number', () => {
      expect(() => {
        schema.kebabCase();
        runChecks(schema, '1');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in camel case', () => {
      expect(() => {
        schema.kebabCase();
        runChecks(schema, camelCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in pascal case', () => {
      expect(() => {
        schema.kebabCase();
        runChecks(schema, pascalCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in snake case', () => {
      expect(() => {
        schema.kebabCase();
        runChecks(schema, snakeCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if in kebab case', () => {
      expect(() => {
        schema.kebabCase();
        runChecks(schema, kebabCase);
      }).not.toThrow();
    });

    it('errors if `null`', () => {
      expect(() => {
        runChecks(schema, null);
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns `null` if nullable', () => {
      expect(runChecks(schema.nullable(), null)).toBeNull();
    });
  });

  describe('lowerCase()', () => {
    beforeEach(() => {
      schema.lowerCase();
    });

    it('errors if value is not lower case', () => {
      expect(() => {
        runChecks(schema, 'FooBar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value is lower case', () => {
      expect(() => {
        runChecks(schema, 'foobar');
      }).not.toThrow();
    });

    it('errors if `null`', () => {
      expect(() => {
        runChecks(schema, null);
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns `null` if nullable', () => {
      expect(runChecks(schema.nullable(), null)).toBeNull();
    });
  });

  describe('match()', () => {
    beforeEach(() => {
      schema.match(/oo/u);
    });

    it('errors if pattern is not a regex', () => {
      expect(() => {
        // @ts-expect-error Testing wrong type
        schema.match(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value does not match pattern', () => {
      expect(() => {
        runChecks(schema, 'bar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value matches default value and predicate is required', () => {
      expect(() => {
        schema.required();

        runChecks(schema, '');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value matches default value and predicate is optional', () => {
      expect(() => {
        runChecks(schema, '');
      }).not.toThrow();
    });

    it('doesnt error if value matches pattern', () => {
      expect(() => {
        runChecks(schema, 'foo');
      }).not.toThrow();
    });

    it('errors if `null`', () => {
      expect(() => {
        runChecks(schema, null);
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns `null` if nullable', () => {
      expect(runChecks(schema.nullable(), null)).toBeNull();
    });
  });

  describe('notEmpty()', () => {
    beforeEach(() => {
      schema.notEmpty();
    });

    it('errors if value is empty', () => {
      expect(() => {
        runChecks(schema, '');
      }).toThrowErrorMatchingSnapshot();
    });

    it('deosnt error if value is not empty', () => {
      expect(() => {
        runChecks(schema, 'foo');
      }).not.toThrow();
    });

    it('doesnt error if null', () => {
      expect(() => {
        schema.nullable();

        runChecks(schema, null);
      }).not.toThrow();
    });
  });

  describe('oneOf()', () => {
    beforeEach(() => {
      schema.oneOf(['foo', 'bar', 'baz']);
    });

    it('errors if not an array', () => {
      expect(() => {
        schema.oneOf(
          // @ts-expect-error Testing wrong type
          123,
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if array is empty', () => {
      expect(() => {
        schema.oneOf([]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if array contains a non-string', () => {
      expect(() => {
        schema.oneOf([
          'foo',
          // @ts-expect-error Testing wrong type
          123,
        ]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is not in the list', () => {
      expect(() => {
        runChecks(schema, 'qux');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value contains token', () => {
      expect(() => {
        runChecks(schema, 'foo');
      }).not.toThrow();
    });

    it('errors if `null`', () => {
      expect(() => {
        runChecks(schema, null);
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns `null` if nullable', () => {
      expect(runChecks(schema.nullable(), null)).toBeNull();
    });
  });

  describe('pascalCase()', () => {
    it('errors if less than 2 characters', () => {
      expect(() => {
        schema.pascalCase();
        runChecks(schema, 'A');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if starts with a number', () => {
      expect(() => {
        schema.pascalCase();
        runChecks(schema, '1');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in camel case', () => {
      expect(() => {
        schema.pascalCase();
        runChecks(schema, camelCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in kebab case', () => {
      expect(() => {
        schema.pascalCase();
        runChecks(schema, kebabCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in snake case', () => {
      expect(() => {
        schema.pascalCase();
        runChecks(schema, snakeCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if in pascal case', () => {
      expect(() => {
        schema.pascalCase();
        runChecks(schema, pascalCase);
      }).not.toThrow();
    });

    it('errors if `null`', () => {
      expect(() => {
        runChecks(schema, null);
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns `null` if nullable', () => {
      expect(runChecks(schema.nullable(), null)).toBeNull();
    });
  });

  describe('sizeOf()', () => {
    beforeEach(() => {
      schema.sizeOf(3);
    });

    it('errors if length doesnt match', () => {
      expect(() => {
        runChecks(schema, '');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if length matches', () => {
      expect(() => {
        runChecks(schema, 'abc');
      }).not.toThrow();
    });

    it('errors if `null`', () => {
      expect(() => {
        runChecks(schema, null);
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns `null` if nullable', () => {
      expect(runChecks(schema.nullable(), null)).toBeNull();
    });
  });

  describe('snakeCase()', () => {
    it('errors if less than 2 characters', () => {
      expect(() => {
        schema.snakeCase();
        runChecks(schema, 'a');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if starts with a number', () => {
      expect(() => {
        schema.snakeCase();
        runChecks(schema, '1');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in camel case', () => {
      expect(() => {
        schema.snakeCase();
        runChecks(schema, camelCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in kebab case', () => {
      expect(() => {
        schema.snakeCase();
        runChecks(schema, kebabCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in pascal case', () => {
      expect(() => {
        schema.snakeCase();
        runChecks(schema, pascalCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if in snake case', () => {
      expect(() => {
        schema.snakeCase();
        runChecks(schema, snakeCase);
      }).not.toThrow();
    });

    it('errors if `null`', () => {
      expect(() => {
        runChecks(schema, null);
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns `null` if nullable', () => {
      expect(runChecks(schema.nullable(), null)).toBeNull();
    });
  });

  describe('upperCase()', () => {
    beforeEach(() => {
      schema.upperCase();
    });

    it('errors if value is not upper case', () => {
      expect(() => {
        runChecks(schema, 'FooBar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value is upper case', () => {
      expect(() => {
        runChecks(schema, 'FOOBAR');
      }).not.toThrow();
    });

    it('errors if `null`', () => {
      expect(() => {
        runChecks(schema, null);
      }).toThrowErrorMatchingSnapshot();
    });

    it('returns `null` if nullable', () => {
      expect(runChecks(schema.nullable(), null)).toBeNull();
    });
  });
});
