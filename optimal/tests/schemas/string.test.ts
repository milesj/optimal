import { string, StringSchema } from '../../src';
import { runInProd } from '../helpers';
import { runCommonTests } from './runCommonTests';

const camelCase = 'fooBarBaz1';
const kebabCase = 'foo-bar-baz2';
const pascalCase = 'FooBarBaz3';
const snakeCase = 'foo_bar_baz4';

describe('string()', () => {
	let schema: StringSchema;

	beforeEach(() => {
		schema = string();
	});

	runCommonTests((defaultValue) => string(defaultValue), 'abc', {
		defaultValue: '',
	});

	describe('camelCase()', () => {
		beforeEach(() => {
			schema.camelCase();
		});

		it('errors if less than 2 characters', () => {
			expect(() => {
				schema.validate('a');
			}).toThrowErrorMatchingInlineSnapshot(
				`"String must be in camel case. (pattern \\"^[a-z][a-zA-Z0-9]+$\\")"`,
			);
		});

		it('errors if starts with a number', () => {
			expect(() => {
				schema.validate('1');
			}).toThrowErrorMatchingInlineSnapshot(
				`"String must be in camel case. (pattern \\"^[a-z][a-zA-Z0-9]+$\\")"`,
			);
		});

		it('errors if in kebab case', () => {
			expect(() => {
				schema.validate(kebabCase);
			}).toThrowErrorMatchingInlineSnapshot(
				`"String must be in camel case. (pattern \\"^[a-z][a-zA-Z0-9]+$\\")"`,
			);
		});

		it('errors if in pascal case', () => {
			expect(() => {
				schema.validate(pascalCase);
			}).toThrowErrorMatchingInlineSnapshot(
				`"String must be in camel case. (pattern \\"^[a-z][a-zA-Z0-9]+$\\")"`,
			);
		});

		it('errors if in snake case', () => {
			expect(() => {
				schema.validate(snakeCase);
			}).toThrowErrorMatchingInlineSnapshot(
				`"String must be in camel case. (pattern \\"^[a-z][a-zA-Z0-9]+$\\")"`,
			);
		});

		it('passes if in camel case', () => {
			expect(() => {
				schema.validate(camelCase);
			}).not.toThrow();
		});

		it('errors if `null`', () => {
			expect(() => {
				schema.validate(null);
			}).toThrowErrorMatchingInlineSnapshot(`"Null is not allowed."`);
		});

		it('returns `null` if nullable', () => {
			expect(schema.nullable().validate(null)).toBeNull();
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
			}).toThrowErrorMatchingInlineSnapshot(`"Contains requires a non-empty token."`);
		});

		it('errors if token is an empty string', () => {
			expect(() => {
				schema.contains('');
			}).toThrowErrorMatchingInlineSnapshot(`"Contains requires a non-empty token."`);
		});

		it('errors if value does not contain token', () => {
			expect(() => {
				schema.validate('bar');
			}).toThrowErrorMatchingInlineSnapshot(`"String does not include \\"oo\\"."`);
		});

		it('errors if value matches default value and predicate is required', () => {
			expect(() => {
				schema.required();
				schema.validate('');
			}).toThrowErrorMatchingInlineSnapshot(`"String does not include \\"oo\\"."`);
		});

		it('doesnt error if value matches default value and predicate is optional', () => {
			expect(() => {
				schema.validate('');
			}).not.toThrow();
		});

		it('doesnt error if value contains token', () => {
			expect(() => {
				schema.validate('foo');
			}).not.toThrow();
		});

		it('errors if `null`', () => {
			expect(() => {
				schema.validate(null);
			}).toThrowErrorMatchingInlineSnapshot(`"Null is not allowed."`);
		});

		it('returns `null` if nullable', () => {
			expect(schema.nullable().validate(null)).toBeNull();
		});
	});

	describe('kebabCase()', () => {
		beforeEach(() => {
			schema.kebabCase();
		});

		it('errors if less than 2 characters', () => {
			expect(() => {
				schema.validate('a');
			}).toThrowErrorMatchingInlineSnapshot(
				`"String must be in kebab case. (pattern \\"^[a-z][a-z0-9-]+$\\")"`,
			);
		});

		it('errors if starts with a number', () => {
			expect(() => {
				schema.validate('1');
			}).toThrowErrorMatchingInlineSnapshot(
				`"String must be in kebab case. (pattern \\"^[a-z][a-z0-9-]+$\\")"`,
			);
		});

		it('errors if in camel case', () => {
			expect(() => {
				schema.validate(camelCase);
			}).toThrowErrorMatchingInlineSnapshot(
				`"String must be in kebab case. (pattern \\"^[a-z][a-z0-9-]+$\\")"`,
			);
		});

		it('errors if in pascal case', () => {
			expect(() => {
				schema.validate(pascalCase);
			}).toThrowErrorMatchingInlineSnapshot(
				`"String must be in kebab case. (pattern \\"^[a-z][a-z0-9-]+$\\")"`,
			);
		});

		it('errors if in snake case', () => {
			expect(() => {
				schema.validate(snakeCase);
			}).toThrowErrorMatchingInlineSnapshot(
				`"String must be in kebab case. (pattern \\"^[a-z][a-z0-9-]+$\\")"`,
			);
		});

		it('passes if in kebab case', () => {
			expect(() => {
				schema.validate(kebabCase);
			}).not.toThrow();
		});

		it('errors if `null`', () => {
			expect(() => {
				schema.validate(null);
			}).toThrowErrorMatchingInlineSnapshot(`"Null is not allowed."`);
		});

		it('returns `null` if nullable', () => {
			expect(schema.nullable().validate(null)).toBeNull();
		});
	});

	describe('lowerCase()', () => {
		beforeEach(() => {
			schema.lowerCase();
		});

		it('errors if value is not lower case', () => {
			expect(() => {
				schema.validate('FooBar');
			}).toThrowErrorMatchingInlineSnapshot(`"String must be lower cased."`);
		});

		it('doesnt error if value is lower case', () => {
			expect(() => {
				schema.validate('foobar');
			}).not.toThrow();
		});

		it('errors if `null`', () => {
			expect(() => {
				schema.validate(null);
			}).toThrowErrorMatchingInlineSnapshot(`"Null is not allowed."`);
		});

		it('returns `null` if nullable', () => {
			expect(schema.nullable().validate(null)).toBeNull();
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
			}).toThrowErrorMatchingInlineSnapshot(
				`"Match requires a regular expression to match against."`,
			);
		});

		it('errors if value does not match pattern', () => {
			expect(() => {
				schema.validate('bar');
			}).toThrowErrorMatchingInlineSnapshot(`"String does not match. (pattern \\"oo\\")"`);
		});

		it('errors if value matches default value and predicate is required', () => {
			expect(() => {
				schema.required();
				schema.validate('');
			}).toThrowErrorMatchingInlineSnapshot(`"String does not match. (pattern \\"oo\\")"`);
		});

		it('doesnt error if value matches default value and predicate is optional', () => {
			expect(() => {
				schema.validate('');
			}).not.toThrow();
		});

		it('doesnt error if value matches pattern', () => {
			expect(() => {
				schema.validate('foo');
			}).not.toThrow();
		});

		it('errors if `null`', () => {
			expect(() => {
				schema.validate(null);
			}).toThrowErrorMatchingInlineSnapshot(`"Null is not allowed."`);
		});

		it('returns `null` if nullable', () => {
			expect(schema.nullable().validate(null)).toBeNull();
		});
	});

	describe('notEmpty()', () => {
		beforeEach(() => {
			schema.notEmpty();
		});

		it('errors if value is empty', () => {
			expect(() => {
				schema.validate('');
			}).toThrowErrorMatchingInlineSnapshot(`"String cannot be empty."`);
		});

		it('deosnt error if value is not empty', () => {
			expect(() => {
				schema.validate('foo');
			}).not.toThrow();
		});

		it('doesnt error if null', () => {
			expect(() => {
				schema.nullable();
				schema.validate(null);
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
			}).toThrowErrorMatchingInlineSnapshot(`"One of requires a non-empty array of strings."`);
		});

		it('errors if array is empty', () => {
			expect(() => {
				schema.oneOf([]);
			}).toThrowErrorMatchingInlineSnapshot(`"One of requires a non-empty array of strings."`);
		});

		it('errors if array contains a non-string', () => {
			expect(() => {
				schema.oneOf([
					'foo',
					// @ts-expect-error Testing wrong type
					123,
				]);
			}).toThrowErrorMatchingInlineSnapshot(`"One of requires a non-empty array of strings."`);
		});

		it('errors if value is not in the list', () => {
			expect(() => {
				schema.validate('qux');
			}).toThrowErrorMatchingInlineSnapshot(`"String must be one of: foo, bar, baz"`);
		});

		it('doesnt error if value contains token', () => {
			expect(() => {
				schema.validate('foo');
			}).not.toThrow();
		});

		it('errors if `null`', () => {
			expect(() => {
				schema.validate(null);
			}).toThrowErrorMatchingInlineSnapshot(`"Null is not allowed."`);
		});

		it('returns `null` if nullable', () => {
			expect(schema.nullable().validate(null)).toBeNull();
		});
	});

	describe('pascalCase()', () => {
		beforeEach(() => {
			schema.pascalCase();
		});

		it('errors if less than 2 characters', () => {
			expect(() => {
				schema.validate('A');
			}).toThrowErrorMatchingInlineSnapshot(
				`"String must be in pascal case. (pattern \\"^[A-Z][a-zA-Z0-9]+$\\")"`,
			);
		});

		it('errors if starts with a number', () => {
			expect(() => {
				schema.validate('1');
			}).toThrowErrorMatchingInlineSnapshot(
				`"String must be in pascal case. (pattern \\"^[A-Z][a-zA-Z0-9]+$\\")"`,
			);
		});

		it('errors if in camel case', () => {
			expect(() => {
				schema.validate(camelCase);
			}).toThrowErrorMatchingInlineSnapshot(
				`"String must be in pascal case. (pattern \\"^[A-Z][a-zA-Z0-9]+$\\")"`,
			);
		});

		it('errors if in kebab case', () => {
			expect(() => {
				schema.validate(kebabCase);
			}).toThrowErrorMatchingInlineSnapshot(
				`"String must be in pascal case. (pattern \\"^[A-Z][a-zA-Z0-9]+$\\")"`,
			);
		});

		it('errors if in snake case', () => {
			expect(() => {
				schema.validate(snakeCase);
			}).toThrowErrorMatchingInlineSnapshot(
				`"String must be in pascal case. (pattern \\"^[A-Z][a-zA-Z0-9]+$\\")"`,
			);
		});

		it('passes if in pascal case', () => {
			expect(() => {
				schema.validate(pascalCase);
			}).not.toThrow();
		});

		it('errors if `null`', () => {
			expect(() => {
				schema.validate(null);
			}).toThrowErrorMatchingInlineSnapshot(`"Null is not allowed."`);
		});

		it('returns `null` if nullable', () => {
			expect(schema.nullable().validate(null)).toBeNull();
		});
	});

	describe('sizeOf()', () => {
		beforeEach(() => {
			schema.sizeOf(3);
		});

		it('errors if length doesnt match', () => {
			expect(() => {
				schema.validate('');
			}).toThrowErrorMatchingInlineSnapshot(`"String length must be 3."`);
		});

		it('doesnt error if length matches', () => {
			expect(() => {
				schema.validate('abc');
			}).not.toThrow();
		});

		it('errors if `null`', () => {
			expect(() => {
				schema.validate(null);
			}).toThrowErrorMatchingInlineSnapshot(`"Null is not allowed."`);
		});

		it('returns `null` if nullable', () => {
			expect(schema.nullable().validate(null)).toBeNull();
		});
	});

	describe('snakeCase()', () => {
		beforeEach(() => {
			schema.snakeCase();
		});

		it('errors if less than 2 characters', () => {
			expect(() => {
				schema.validate('a');
			}).toThrowErrorMatchingInlineSnapshot(
				`"String must be in snake case. (pattern \\"^[a-z][a-z0-9_]+$\\")"`,
			);
		});

		it('errors if starts with a number', () => {
			expect(() => {
				schema.validate('1');
			}).toThrowErrorMatchingInlineSnapshot(
				`"String must be in snake case. (pattern \\"^[a-z][a-z0-9_]+$\\")"`,
			);
		});

		it('errors if in camel case', () => {
			expect(() => {
				schema.validate(camelCase);
			}).toThrowErrorMatchingInlineSnapshot(
				`"String must be in snake case. (pattern \\"^[a-z][a-z0-9_]+$\\")"`,
			);
		});

		it('errors if in kebab case', () => {
			expect(() => {
				schema.validate(kebabCase);
			}).toThrowErrorMatchingInlineSnapshot(
				`"String must be in snake case. (pattern \\"^[a-z][a-z0-9_]+$\\")"`,
			);
		});

		it('errors if in pascal case', () => {
			expect(() => {
				schema.validate(pascalCase);
			}).toThrowErrorMatchingInlineSnapshot(
				`"String must be in snake case. (pattern \\"^[a-z][a-z0-9_]+$\\")"`,
			);
		});

		it('passes if in snake case', () => {
			expect(() => {
				schema.validate(snakeCase);
			}).not.toThrow();
		});

		it('errors if `null`', () => {
			expect(() => {
				schema.validate(null);
			}).toThrowErrorMatchingInlineSnapshot(`"Null is not allowed."`);
		});

		it('returns `null` if nullable', () => {
			expect(schema.nullable().validate(null)).toBeNull();
		});
	});

	describe('upperCase()', () => {
		beforeEach(() => {
			schema.upperCase();
		});

		it('errors if value is not upper case', () => {
			expect(() => {
				schema.validate('FooBar');
			}).toThrowErrorMatchingInlineSnapshot(`"String must be upper cased."`);
		});

		it('doesnt error if value is upper case', () => {
			expect(() => {
				schema.validate('FOOBAR');
			}).not.toThrow();
		});

		it('errors if `null`', () => {
			expect(() => {
				schema.validate(null);
			}).toThrowErrorMatchingInlineSnapshot(`"Null is not allowed."`);
		});

		it('returns `null` if nullable', () => {
			expect(schema.nullable().validate(null)).toBeNull();
		});
	});

	describe('type()', () => {
		it('returns "string"', () => {
			expect(string().type()).toBe('string');
		});
	});

	describe('validateType()', () => {
		it('errors if a non-string is passed', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				schema.validate(123);
			}).toThrow('Must be a string.');
		});

		it('doesnt error if a string is passed', () => {
			expect(() => {
				schema.validate('foo');
			}).not.toThrow();
		});

		it('returns passed string', () => {
			expect(schema.validate('foo')).toBe('foo');
		});

		it('returns default value if undefined passed', () => {
			expect(schema.validate(undefined)).toBe('');
		});

		it('errors if null is passed', () => {
			expect(() => {
				schema.validate(null);
			}).toThrow('Null is not allowed.');
		});

		describe('production', () => {
			it(
				'doesnt error if a non-string is passed',
				runInProd(() => {
					expect(() => {
						// @ts-expect-error Invalid type
						schema.validate(123);
					}).not.toThrow();
				}),
			);
		});
	});
});
