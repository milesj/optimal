import { AnySchema, blueprint, number, ObjectSchema, string } from '../../src';

describe('blueprint()', () => {
	let schema: ObjectSchema<Record<string, AnySchema>>;

	beforeEach(() => {
		schema = blueprint({
			foo: string(),
			bar: number(),
		});
	});

	describe('type()', () => {
		it('returns shape type', () => {
			expect(blueprint().type()).toBe(
				'object<shape<{ schema: function, state: function, type: function, validate: function }>>',
			);
		});
	});

	describe('validateType()', () => {
		it('errors if a non-object is passed', () => {
			expect(() => {
				schema.validate(123);
			}).toThrow('Must be a plain object, received number.');
		});

		it('errors if a value is not a schema', () => {
			expect(() => {
				schema.validate({ foo: 123 });
			}).toThrowErrorMatchingInlineSnapshot(
				`"Invalid field \\"foo\\". Must be a schema, received number."`,
			);
		});

		it('errors if null is passed', () => {
			expect(() => {
				schema.validate(null);
			}).toThrow('Null is not allowed.');
		});
	});
});
