import { string, StringPredicate } from '../../src';
import { runChecks, runInProd } from '../helpers';

const camelCase = 'fooBarBaz1';
const kebabCase = 'foo-bar-baz2';
const pascalCase = 'FooBarBaz3';
const snakeCase = 'foo_bar_baz4';

describe('StringPredicate', () => {
  let predicate: StringPredicate;

  beforeEach(() => {
    predicate = string();
  });

  it('sets default value', () => {
    expect(string('bar').defaultValue).toBe('bar');
  });

  describe('default()', () => {
    it('returns the default value', () => {
      expect(string('foo').default()).toBe('foo');
    });
  });

  describe('run()', () => {
    it('errors if a non-string value is used', () => {
      expect(() => {
        runChecks(
          predicate,
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
              predicate,
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
        predicate.camelCase();
        runChecks(predicate, 'a');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if starts with a number', () => {
      expect(() => {
        predicate.camelCase();
        runChecks(predicate, '1');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in kebab case', () => {
      expect(() => {
        predicate.camelCase();
        runChecks(predicate, kebabCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in pascal case', () => {
      expect(() => {
        predicate.camelCase();
        runChecks(predicate, pascalCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in snake case', () => {
      expect(() => {
        predicate.camelCase();
        runChecks(predicate, snakeCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if in camel case', () => {
      expect(() => {
        predicate.camelCase();
        runChecks(predicate, camelCase);
      }).not.toThrow();
    });
  });

  describe('contains()', () => {
    beforeEach(() => {
      predicate.contains('oo');
    });

    it('errors if token is not string', () => {
      expect(() => {
        // @ts-ignore Testing wrong type
        predicate.contains(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if token is an empty string', () => {
      expect(() => {
        predicate.contains('');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value does not contain token', () => {
      expect(() => {
        runChecks(predicate, 'bar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value matches default value and predicate is required', () => {
      expect(() => {
        predicate.required();

        runChecks(predicate, '');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value matches default value and predicate is optional', () => {
      expect(() => {
        runChecks(predicate, '');
      }).not.toThrow();
    });

    it('doesnt error if value contains token', () => {
      expect(() => {
        runChecks(predicate, 'foo');
      }).not.toThrow();
    });
  });

  describe('kebabCase()', () => {
    it('errors if less than 2 characters', () => {
      expect(() => {
        predicate.kebabCase();
        runChecks(predicate, 'a');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if starts with a number', () => {
      expect(() => {
        predicate.kebabCase();
        runChecks(predicate, '1');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in camel case', () => {
      expect(() => {
        predicate.kebabCase();
        runChecks(predicate, camelCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in pascal case', () => {
      expect(() => {
        predicate.kebabCase();
        runChecks(predicate, pascalCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in snake case', () => {
      expect(() => {
        predicate.kebabCase();
        runChecks(predicate, snakeCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if in kebab case', () => {
      expect(() => {
        predicate.kebabCase();
        runChecks(predicate, kebabCase);
      }).not.toThrow();
    });
  });

  describe('lowerCase()', () => {
    beforeEach(() => {
      predicate.lowerCase();
    });

    it('errors if value is not lower case', () => {
      expect(() => {
        runChecks(predicate, 'FooBar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value is lower case', () => {
      expect(() => {
        runChecks(predicate, 'foobar');
      }).not.toThrow();
    });
  });

  describe('match()', () => {
    beforeEach(() => {
      predicate.match(/oo/u);
    });

    it('errors if pattern is not a regex', () => {
      expect(() => {
        // @ts-ignore Testing wrong type
        predicate.match(123);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value does not match pattern', () => {
      expect(() => {
        runChecks(predicate, 'bar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value matches default value and predicate is required', () => {
      expect(() => {
        predicate.required();

        runChecks(predicate, '');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value matches default value and predicate is optional', () => {
      expect(() => {
        runChecks(predicate, '');
      }).not.toThrow();
    });

    it('doesnt error if value matches pattern', () => {
      expect(() => {
        runChecks(predicate, 'foo');
      }).not.toThrow();
    });
  });

  describe('notEmpty()', () => {
    beforeEach(() => {
      predicate.notEmpty();
    });

    it('errors if value is empty', () => {
      expect(() => {
        runChecks(predicate, '');
      }).toThrowErrorMatchingSnapshot();
    });

    it('deosnt error if value is not empty', () => {
      expect(() => {
        runChecks(predicate, 'foo');
      }).not.toThrow();
    });
  });

  describe('oneOf()', () => {
    beforeEach(() => {
      predicate.oneOf(['foo', 'bar', 'baz']);
    });

    it('errors if not an array', () => {
      expect(() => {
        predicate.oneOf(
          // @ts-ignore Testing wrong type
          123,
        );
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if array is empty', () => {
      expect(() => {
        predicate.oneOf([]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if array contains a non-string', () => {
      expect(() => {
        predicate.oneOf([
          'foo',
          // @ts-ignore Testing wrong type
          123,
        ]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if value is not in the list', () => {
      expect(() => {
        runChecks(predicate, 'qux');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value contains token', () => {
      expect(() => {
        runChecks(predicate, 'foo');
      }).not.toThrow();
    });
  });

  describe('pascalCase()', () => {
    it('errors if less than 2 characters', () => {
      expect(() => {
        predicate.pascalCase();
        runChecks(predicate, 'A');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if starts with a number', () => {
      expect(() => {
        predicate.pascalCase();
        runChecks(predicate, '1');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in camel case', () => {
      expect(() => {
        predicate.pascalCase();
        runChecks(predicate, camelCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in kebab case', () => {
      expect(() => {
        predicate.pascalCase();
        runChecks(predicate, kebabCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in snake case', () => {
      expect(() => {
        predicate.pascalCase();
        runChecks(predicate, snakeCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if in pascal case', () => {
      expect(() => {
        predicate.pascalCase();
        runChecks(predicate, pascalCase);
      }).not.toThrow();
    });
  });

  describe('sizeOf()', () => {
    beforeEach(() => {
      predicate.sizeOf(3);
    });

    it('errors if length doesnt match', () => {
      expect(() => {
        runChecks(predicate, '');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if length matches', () => {
      expect(() => {
        runChecks(predicate, 'abc');
      }).not.toThrow();
    });
  });

  describe('snakeCase()', () => {
    it('errors if less than 2 characters', () => {
      expect(() => {
        predicate.snakeCase();
        runChecks(predicate, 'a');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if starts with a number', () => {
      expect(() => {
        predicate.snakeCase();
        runChecks(predicate, '1');
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in camel case', () => {
      expect(() => {
        predicate.snakeCase();
        runChecks(predicate, camelCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in kebab case', () => {
      expect(() => {
        predicate.snakeCase();
        runChecks(predicate, kebabCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if in pascal case', () => {
      expect(() => {
        predicate.snakeCase();
        runChecks(predicate, pascalCase);
      }).toThrowErrorMatchingSnapshot();
    });

    it('passes if in snake case', () => {
      expect(() => {
        predicate.snakeCase();
        runChecks(predicate, snakeCase);
      }).not.toThrow();
    });
  });

  describe('upperCase()', () => {
    beforeEach(() => {
      predicate.upperCase();
    });

    it('errors if value is not upper case', () => {
      expect(() => {
        runChecks(predicate, 'FooBar');
      }).toThrowErrorMatchingSnapshot();
    });

    it('doesnt error if value is upper case', () => {
      expect(() => {
        runChecks(predicate, 'FOOBAR');
      }).not.toThrow();
    });
  });

  describe('typeAlias()', () => {
    it('returns the type name', () => {
      expect(string().typeAlias()).toBe('string');
    });
  });
});
