import { array, Infer, number, object, ObjectSchema, string, tuple } from '../../src';
import { runCommonTests } from './runCommonTests';

describe('object()', () => {
	let schema: ObjectSchema<Record<string, string>>;

	beforeEach(() => {
		schema = object().of(string());
	});

	const arrayObject = object().of(array().of(string()));
	const objectTupleObject = object().of(object().of(tuple<[string, number]>([string(), number()])));

	type StringObject = Infer<typeof schema>;
	type ArrayObject = Infer<typeof arrayObject>;
	type ObjectTupleObject = Infer<typeof objectTupleObject>;

	runCommonTests<Record<string, string>>(
		(defaultValue) => object(defaultValue),
		{ a: 'b' },
		{
			defaultValue: {},
		},
	);

	describe('keysOf()', () => {
		let keysOfSchema: typeof schema;

		beforeEach(() => {
			keysOfSchema = schema.keysOf(string().camelCase());
		});

		it('errors if a non-schema is passed', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				schema.keysOf('abc');
			}).toThrow('A string schema is required for object keys.');
		});

		it('errors if a non-string schema is passed', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				schema.keysOf(number());
			}).toThrow('A string schema is required for object keys.');
		});

		it('errors if key doesnt match schema', () => {
			expect(() => {
				keysOfSchema.validate({
					fooBar: '',
					baz_qux: '',
				});
			}).toThrow(
				'Invalid key "baz_qux". String must be in camel case. (pattern "^[a-z][a-zA-Z0-9]+$")',
			);
		});
	});

	describe('notEmpty()', () => {
		let notEmptySchema: typeof schema;

		beforeEach(() => {
			notEmptySchema = schema.notEmpty();
		});

		it('errors if object is empty', () => {
			expect(() => {
				notEmptySchema.validate({});
			}).toThrow('Object cannot be empty.');
		});

		it('doesnt error if object is non-empty', () => {
			expect(() => {
				notEmptySchema.validate({ foo: 'bar' });
			}).not.toThrow();
		});
	});

	describe('sizeOf()', () => {
		let sizeOfSchema: typeof schema;

		beforeEach(() => {
			sizeOfSchema = schema.sizeOf(1);
		});

		it('errors if a non-number is passed', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				schema.sizeOf('abc');
			}).toThrow('Size of requires a non-zero positive number.');
		});

		it('errors if object has less properties', () => {
			expect(() => {
				sizeOfSchema.validate({});
			}).toThrow('Object must have 1 property.');
		});

		it('errors if object has more properties', () => {
			expect(() => {
				sizeOfSchema.validate({ a: 'a', b: 'b' });
			}).toThrow('Object must have 1 property.');
		});

		it('doesnt error if object has exact properties', () => {
			expect(() => {
				sizeOfSchema.validate({ foo: 'bar' });
			}).not.toThrow();
		});
	});

	describe('type()', () => {
		it('returns "object"', () => {
			expect(object().type()).toBe('object');
		});

		it('returns "object" with subtype', () => {
			expect(object().of(string()).type()).toBe('object<string>');
		});
	});

	describe('validateType()', () => {
		it('doesnt error if an object is passed', () => {
			expect(() => {
				schema.validate({ foo: 'bar' });
			}).not.toThrow();
		});

		it('returns passed object', () => {
			expect(schema.validate({ foo: 'bar' })).toEqual({ foo: 'bar' });
		});

		it('returns default value if undefined passed', () => {
			expect(schema.validate(undefined)).toEqual({});
		});

		it('errors if null is passed', () => {
			expect(() => {
				schema.validate(null);
			}).toThrow('Null is not allowed.');
		});

		it('errors if a non-object is passed', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				schema.validate(123);
			}).toThrow('Must be a plain object.');
		});

		it('errors if object value type is invalid', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				schema.validate({ a: 123 });
			}).toThrow('Must be a string.');
		});
	});
});
