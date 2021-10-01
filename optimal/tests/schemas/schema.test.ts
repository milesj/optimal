import { AnySchema, Infer, schema as schemaFunc, ShapeSchema, StringSchema } from '../../src';

describe('schema()', () => {
	let schema: ShapeSchema<AnySchema>;

	beforeEach(() => {
		schema = schemaFunc();
	});

	const stringSchema = schemaFunc<StringSchema>();

	type AllSchema = Infer<typeof schema>;
	type StringsSchema = Infer<typeof stringSchema>;

	describe('type()', () => {
		it('returns shape type', () => {
			expect(schemaFunc().type()).toBe(
				'shape<{ schema: function, state: function, type: function, validate: function }>',
			);
		});
	});

	describe('validateType()', () => {
		it('errors if a non-object is passed', () => {
			expect(() => {
				schema.validate(123);
			}).toThrow('Must be a schema, received number.');
		});

		it('errors if no fields provided', () => {
			expect(() => {
				schema.validate({});
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - Invalid field \\"schema\\". Must be a function, received undefined.
			  - Invalid field \\"state\\". Must be a function, received undefined.
			  - Invalid field \\"type\\". Must be a function, received undefined.
			  - Invalid field \\"validate\\". Must be a function, received undefined."
		`);
		});

		it('errors if a schema is not a function', () => {
			expect(() => {
				schema.validate({ schema: 123 });
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - Invalid field \\"schema\\". Must be a function, received number.
			  - Invalid field \\"state\\". Must be a function, received undefined.
			  - Invalid field \\"type\\". Must be a function, received undefined.
			  - Invalid field \\"validate\\". Must be a function, received undefined."
		`);
		});

		it('errors if a type is not a function', () => {
			expect(() => {
				schema.validate({ schema() {}, type: 123 });
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - Invalid field \\"state\\". Must be a function, received undefined.
			  - Invalid field \\"type\\". Must be a function, received number.
			  - Invalid field \\"validate\\". Must be a function, received undefined."
		`);
		});

		it('errors if a validate is not a function', () => {
			expect(() => {
				schema.validate({ schema() {}, type() {}, validate: 123 });
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - Invalid field \\"state\\". Must be a function, received undefined.
			  - Invalid field \\"validate\\". Must be a function, received number."
		`);
		});

		it('errors if null is passed', () => {
			expect(() => {
				schema.validate(null);
			}).toThrow('Null is not allowed.');
		});
	});
});
