import { Infer, string, StringSchema } from '../../src';
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

	const litString = string().oneOf(['a', 'b', 'c']);

	type AnyString = Infer<typeof schema>;
	type LiteralString = Infer<typeof litString>;

	runCommonTests((defaultValue) => string(defaultValue), 'abc', {
		defaultValue: '',
	});

	describe('camelCase()', () => {
		let camelSchema: StringSchema;

		beforeEach(() => {
			camelSchema = schema.camelCase();
		});

		it('errors if less than 2 characters', () => {
			expect(() => {
				camelSchema.validate('a');
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be in camel case. (pattern \\"^[a-z][a-zA-Z0-9]+$\\")"
		`);
		});

		it('errors if starts with a number', () => {
			expect(() => {
				camelSchema.validate('1');
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be in camel case. (pattern \\"^[a-z][a-zA-Z0-9]+$\\")"
		`);
		});

		it('errors if in kebab case', () => {
			expect(() => {
				camelSchema.validate(kebabCase);
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be in camel case. (pattern \\"^[a-z][a-zA-Z0-9]+$\\")"
		`);
		});

		it('errors if in pascal case', () => {
			expect(() => {
				camelSchema.validate(pascalCase);
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be in camel case. (pattern \\"^[a-z][a-zA-Z0-9]+$\\")"
		`);
		});

		it('errors if in snake case', () => {
			expect(() => {
				camelSchema.validate(snakeCase);
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be in camel case. (pattern \\"^[a-z][a-zA-Z0-9]+$\\")"
		`);
		});

		it('passes if in camel case', () => {
			expect(() => {
				camelSchema.validate(camelCase);
			}).not.toThrow();
		});

		it('errors if `null`', () => {
			expect(() => {
				camelSchema.validate(null);
			}).toThrowErrorMatchingInlineSnapshot(`"Null is not allowed."`);
		});

		it('returns `null` if nullable', () => {
			expect(camelSchema.nullable().validate(null)).toBeNull();
		});
	});

	describe('contains()', () => {
		let containsSchema: StringSchema;

		beforeEach(() => {
			containsSchema = schema.contains('oo');
		});

		it('errors if token is not string', () => {
			expect(() => {
				// @ts-expect-error Testing wrong type
				containsSchema.contains(123);
			}).toThrowErrorMatchingInlineSnapshot(`"Contains requires a non-empty token."`);
		});

		it('errors if token is an empty string', () => {
			expect(() => {
				containsSchema.contains('');
			}).toThrowErrorMatchingInlineSnapshot(`"Contains requires a non-empty token."`);
		});

		it('errors if value does not contain token', () => {
			expect(() => {
				containsSchema.validate('bar');
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String does not include \\"oo\\"."
		`);
		});

		it('errors if value matches default value and predicate is required', () => {
			expect(() => {
				containsSchema.required().validate('');
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String does not include \\"oo\\"."
		`);
		});

		it('doesnt error if value matches default value and predicate is optional', () => {
			expect(() => {
				containsSchema.validate('');
			}).not.toThrow();
		});

		it('doesnt error if value contains token', () => {
			expect(() => {
				containsSchema.validate('foo');
			}).not.toThrow();
		});

		it('errors if `null`', () => {
			expect(() => {
				containsSchema.validate(null);
			}).toThrowErrorMatchingInlineSnapshot(`"Null is not allowed."`);
		});

		it('returns `null` if nullable', () => {
			expect(containsSchema.nullable().validate(null)).toBeNull();
		});
	});

	describe('kebabCase()', () => {
		let kebabSchema: StringSchema;

		beforeEach(() => {
			kebabSchema = schema.kebabCase();
		});

		it('errors if less than 2 characters', () => {
			expect(() => {
				kebabSchema.validate('a');
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be in kebab case. (pattern \\"^[a-z][a-z0-9-]+$\\")"
		`);
		});

		it('errors if starts with a number', () => {
			expect(() => {
				kebabSchema.validate('1');
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be in kebab case. (pattern \\"^[a-z][a-z0-9-]+$\\")"
		`);
		});

		it('errors if in camel case', () => {
			expect(() => {
				kebabSchema.validate(camelCase);
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be in kebab case. (pattern \\"^[a-z][a-z0-9-]+$\\")"
		`);
		});

		it('errors if in pascal case', () => {
			expect(() => {
				kebabSchema.validate(pascalCase);
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be in kebab case. (pattern \\"^[a-z][a-z0-9-]+$\\")"
		`);
		});

		it('errors if in snake case', () => {
			expect(() => {
				kebabSchema.validate(snakeCase);
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be in kebab case. (pattern \\"^[a-z][a-z0-9-]+$\\")"
		`);
		});

		it('passes if in kebab case', () => {
			expect(() => {
				kebabSchema.validate(kebabCase);
			}).not.toThrow();
		});

		it('errors if `null`', () => {
			expect(() => {
				kebabSchema.validate(null);
			}).toThrowErrorMatchingInlineSnapshot(`"Null is not allowed."`);
		});

		it('returns `null` if nullable', () => {
			expect(kebabSchema.nullable().validate(null)).toBeNull();
		});
	});

	describe('lowerCase()', () => {
		let lowerSchema: StringSchema;

		beforeEach(() => {
			lowerSchema = schema.lowerCase();
		});

		it('errors if value is not lower case', () => {
			expect(() => {
				lowerSchema.validate('FooBar');
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be lower cased."
		`);
		});

		it('doesnt error if value is lower case', () => {
			expect(() => {
				lowerSchema.validate('foobar');
			}).not.toThrow();
		});

		it('errors if `null`', () => {
			expect(() => {
				lowerSchema.validate(null);
			}).toThrowErrorMatchingInlineSnapshot(`"Null is not allowed."`);
		});

		it('returns `null` if nullable', () => {
			expect(lowerSchema.nullable().validate(null)).toBeNull();
		});
	});

	describe('match()', () => {
		let matchSchema: StringSchema;

		beforeEach(() => {
			matchSchema = schema.match(/oo/u);
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
				matchSchema.validate('bar');
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String does not match. (pattern \\"oo\\")"
		`);
		});

		it('errors if value matches default value and predicate is required', () => {
			expect(() => {
				matchSchema.required().validate('');
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String does not match. (pattern \\"oo\\")"
		`);
		});

		it('doesnt error if value matches default value and predicate is optional', () => {
			expect(() => {
				matchSchema.validate('');
			}).not.toThrow();
		});

		it('doesnt error if value matches pattern', () => {
			expect(() => {
				matchSchema.validate('foo');
			}).not.toThrow();
		});

		it('errors if `null`', () => {
			expect(() => {
				matchSchema.validate(null);
			}).toThrowErrorMatchingInlineSnapshot(`"Null is not allowed."`);
		});

		it('returns `null` if nullable', () => {
			expect(matchSchema.nullable().validate(null)).toBeNull();
		});
	});

	describe('notEmpty()', () => {
		let notEmptySchema: StringSchema;

		beforeEach(() => {
			notEmptySchema = schema.notEmpty();
		});

		it('errors if value is empty', () => {
			expect(() => {
				notEmptySchema.validate('');
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String cannot be empty."
		`);
		});

		it('deosnt error if value is not empty', () => {
			expect(() => {
				notEmptySchema.validate('foo');
			}).not.toThrow();
		});

		it('doesnt error if null', () => {
			expect(() => {
				notEmptySchema.nullable().validate(null);
			}).not.toThrow();
		});
	});

	describe('oneOf()', () => {
		let oneOfSchema: StringSchema<'bar' | 'baz' | 'foo'>;

		beforeEach(() => {
			oneOfSchema = schema.oneOf(['foo', 'bar', 'baz']);
		});

		it('errors if not an array', () => {
			expect(() => {
				schema.oneOf(
					// @ts-expect-error Testing wrong type
					123,
				);
			}).toThrowErrorMatchingInlineSnapshot(`"One of requires an array of strings."`);
		});

		it('errors if array is empty', () => {
			expect(() => {
				schema.oneOf([]);
			}).toThrowErrorMatchingInlineSnapshot(`"One of requires an array of strings."`);
		});

		it('errors if array contains a non-string', () => {
			expect(() => {
				schema.oneOf([
					'foo',
					// @ts-expect-error Testing wrong type
					123,
				]);
			}).toThrowErrorMatchingInlineSnapshot(`"One of requires an array of strings."`);
		});

		it('doesnt error if an empty value is provided', () => {
			expect(() => {
				schema.oneOf(['']);
			}).not.toThrow();
		});

		it('errors if value is not in the list', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				oneOfSchema.validate('qux');
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be one of: foo, bar, baz"
		`);
		});

		it('doesnt error if value contains token', () => {
			expect(() => {
				oneOfSchema.validate('foo');
			}).not.toThrow();
		});

		it('errors if `null`', () => {
			expect(() => {
				oneOfSchema.validate(null);
			}).toThrowErrorMatchingInlineSnapshot(`"Null is not allowed."`);
		});

		it('returns `null` if nullable', () => {
			expect(oneOfSchema.nullable().validate(null)).toBeNull();
		});
	});

	describe('pascalCase()', () => {
		let pascalSchema: StringSchema;

		beforeEach(() => {
			pascalSchema = schema.pascalCase();
		});

		it('errors if less than 2 characters', () => {
			expect(() => {
				pascalSchema.validate('A');
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be in pascal case. (pattern \\"^[A-Z][a-zA-Z0-9]+$\\")"
		`);
		});

		it('errors if starts with a number', () => {
			expect(() => {
				pascalSchema.validate('1');
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be in pascal case. (pattern \\"^[A-Z][a-zA-Z0-9]+$\\")"
		`);
		});

		it('errors if in camel case', () => {
			expect(() => {
				pascalSchema.validate(camelCase);
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be in pascal case. (pattern \\"^[A-Z][a-zA-Z0-9]+$\\")"
		`);
		});

		it('errors if in kebab case', () => {
			expect(() => {
				pascalSchema.validate(kebabCase);
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be in pascal case. (pattern \\"^[A-Z][a-zA-Z0-9]+$\\")"
		`);
		});

		it('errors if in snake case', () => {
			expect(() => {
				pascalSchema.validate(snakeCase);
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be in pascal case. (pattern \\"^[A-Z][a-zA-Z0-9]+$\\")"
		`);
		});

		it('passes if in pascal case', () => {
			expect(() => {
				pascalSchema.validate(pascalCase);
			}).not.toThrow();
		});

		it('errors if `null`', () => {
			expect(() => {
				pascalSchema.validate(null);
			}).toThrowErrorMatchingInlineSnapshot(`"Null is not allowed."`);
		});

		it('returns `null` if nullable', () => {
			expect(pascalSchema.nullable().validate(null)).toBeNull();
		});
	});

	describe('sizeOf()', () => {
		let sizeOfSchema: StringSchema;

		beforeEach(() => {
			sizeOfSchema = schema.sizeOf(3);
		});

		it('errors if length doesnt match', () => {
			expect(() => {
				sizeOfSchema.validate('');
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String length must be 3."
		`);
		});

		it('doesnt error if length matches', () => {
			expect(() => {
				sizeOfSchema.validate('abc');
			}).not.toThrow();
		});

		it('errors if `null`', () => {
			expect(() => {
				sizeOfSchema.validate(null);
			}).toThrowErrorMatchingInlineSnapshot(`"Null is not allowed."`);
		});

		it('returns `null` if nullable', () => {
			expect(sizeOfSchema.nullable().validate(null)).toBeNull();
		});
	});

	describe('snakeCase()', () => {
		let snakeSchema: StringSchema;

		beforeEach(() => {
			snakeSchema = schema.snakeCase();
		});

		it('errors if less than 2 characters', () => {
			expect(() => {
				snakeSchema.validate('a');
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be in snake case. (pattern \\"^[a-z][a-z0-9_]+$\\")"
		`);
		});

		it('errors if starts with a number', () => {
			expect(() => {
				snakeSchema.validate('1');
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be in snake case. (pattern \\"^[a-z][a-z0-9_]+$\\")"
		`);
		});

		it('errors if in camel case', () => {
			expect(() => {
				snakeSchema.validate(camelCase);
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be in snake case. (pattern \\"^[a-z][a-z0-9_]+$\\")"
		`);
		});

		it('errors if in kebab case', () => {
			expect(() => {
				snakeSchema.validate(kebabCase);
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be in snake case. (pattern \\"^[a-z][a-z0-9_]+$\\")"
		`);
		});

		it('errors if in pascal case', () => {
			expect(() => {
				snakeSchema.validate(pascalCase);
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be in snake case. (pattern \\"^[a-z][a-z0-9_]+$\\")"
		`);
		});

		it('passes if in snake case', () => {
			expect(() => {
				snakeSchema.validate(snakeCase);
			}).not.toThrow();
		});

		it('errors if `null`', () => {
			expect(() => {
				snakeSchema.validate(null);
			}).toThrowErrorMatchingInlineSnapshot(`"Null is not allowed."`);
		});

		it('returns `null` if nullable', () => {
			expect(snakeSchema.nullable().validate(null)).toBeNull();
		});
	});

	describe('upperCase()', () => {
		let upperSchema: StringSchema;

		beforeEach(() => {
			upperSchema = schema.upperCase();
		});

		it('errors if value is not upper case', () => {
			expect(() => {
				upperSchema.validate('FooBar');
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - String must be upper cased."
		`);
		});

		it('doesnt error if value is upper case', () => {
			expect(() => {
				upperSchema.validate('FOOBAR');
			}).not.toThrow();
		});

		it('errors if `null`', () => {
			expect(() => {
				upperSchema.validate(null);
			}).toThrowErrorMatchingInlineSnapshot(`"Null is not allowed."`);
		});

		it('returns `null` if nullable', () => {
			expect(upperSchema.nullable().validate(null)).toBeNull();
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
