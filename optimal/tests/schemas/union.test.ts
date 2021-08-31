import {
	array,
	bool,
	custom,
	Infer,
	instance,
	number,
	object,
	shape,
	string,
	tuple,
	union,
	UnionSchema,
} from '../../src';
import { runCommonTests } from './runCommonTests';

class Foo {}
class Bar {}

interface ExampleShape {
	foo: string;
	bar: number;
	baz: boolean;
}

describe('union()', () => {
	type UnionStrings = 'bar' | 'baz' | 'foo';
	type Union = Foo | Record<string, number> | string[] | UnionStrings | number | true | null;
	let schema: UnionSchema<Union>;

	beforeEach(() => {
		schema = union<Union>('baz').of([
			array().of(string()),
			bool(true).onlyTrue(),
			number().between(0, 5),
			instance().of(Foo),
			object().of(number()),
			string('foo').oneOf(['foo', 'bar', 'baz']),
		]);
	});

	type AllUnion = Infer<typeof schema>;

	runCommonTests<Union>(
		(defaultValue) =>
			union<Union>(defaultValue!).of([
				array().of(string()),
				bool(true).onlyTrue(),
				number().between(0, 5),
				instance().of(Foo),
				object().of(number()),
				string('foo').oneOf(['foo', 'bar', 'baz']),
			]),
		'baz',
		{
			defaultValue: 1,
		},
	);

	it('errors if a unsupported type is used', () => {
		expect(() => {
			union<boolean | number | string>(0)
				.of([bool(), number(), string()])
				// @ts-expect-error Invalid type
				.validate({});
		}).toThrowErrorMatchingInlineSnapshot(`"Value must be one of: boolean, number, string."`);
	});

	it('errors if a nested union is used', () => {
		expect(() => {
			union<string[]>([])
				.of([string('foo'), union([]).of([number(), bool()])])
				.validate([]);
		}).toThrowErrorMatchingInlineSnapshot(`"Nested unions are not supported."`);
	});

	it('errors with the class name for instance checks', () => {
		expect(() => {
			union<Buffer | number | null>(0)
				.of([number(), instance().of(Buffer)])
				// @ts-expect-error Invalid type
				.validate(new Foo());
		}).toThrowErrorMatchingInlineSnapshot(`
		"Value must be one of: number, Buffer. Received class with the following invalidations:
		  - Must be an instance of \\"Buffer\\"."
	`);
	});

	it('returns default value if value is undefined', () => {
		expect(schema.validate(undefined)).toEqual('baz');
	});

	it('runs array check', () => {
		expect(() => {
			schema.validate([123]);
		}).toThrowErrorMatchingInlineSnapshot(`
		"Value must be one of: array<string>, boolean, number, Foo, object<number>, string. Received array/tuple with the following invalidations:
		  - Must be a string."
	`);
	});

	it('runs boolean check', () => {
		expect(() => {
			schema.validate(false);
		}).toThrowErrorMatchingInlineSnapshot(`
		"Value must be one of: array<string>, boolean, number, Foo, object<number>, string. Received boolean with the following invalidations:
		  - May only be \`true\`."
	`);
	});

	it('runs custom check', () => {
		expect(() => {
			union(0)
				.of([
					string(),
					custom((value) => {
						if (typeof value === 'number') {
							throw new TypeError('Encountered a number!');
						}
					}, ''),
				])
				.validate(123);
		}).toThrowErrorMatchingInlineSnapshot(`
		"Value must be one of: string, custom. Received number with the following invalidations:
		  - Encountered a number!"
	`);
	});

	it('runs instance check', () => {
		expect(() => {
			schema.validate(new Bar());
		}).toThrowErrorMatchingInlineSnapshot(`
		"Value must be one of: array<string>, boolean, number, Foo, object<number>, string. Received class with the following invalidations:
		  - Must be an instance of \\"Foo\\"."
	`);
	});

	it('runs number check', () => {
		expect(() => {
			schema.validate(10);
		}).toThrowErrorMatchingInlineSnapshot(`
		"Value must be one of: array<string>, boolean, number, Foo, object<number>, string. Received number with the following invalidations:
		  - Number must be between 0 and 5."
	`);
	});

	it('runs object check', () => {
		expect(() => {
			schema.validate({ foo: 'foo' });
		}).toThrowErrorMatchingInlineSnapshot(`
		"Value must be one of: array<string>, boolean, number, Foo, object<number>, string. Received object/shape with the following invalidations:
		  - Must be a number."
	`);
	});

	it('runs shape check', () => {
		expect(() => {
			union({ foo: '', bar: 0 })
				.of([
					shape({
						foo: string(),
						bar: number(),
					}),
				])

				// @ts-expect-error Invalid type
				.validate({ foo: 123 });
		}).toThrowErrorMatchingInlineSnapshot(`
		"Value must be one of: shape<{ foo: string, bar: number }>. Received object/shape with the following invalidations:
		  - Must be a string."
	`);
	});

	it('runs string check', () => {
		expect(() => {
			schema.validate('qux');
		}).toThrowErrorMatchingInlineSnapshot(`
		"Value must be one of: array<string>, boolean, number, Foo, object<number>, string. Received string with the following invalidations:
		  - String must be one of: foo, bar, baz"
	`);
	});

	it('runs tuple check', () => {
		expect(() => {
			union(['foo', 'bar', 'baz'])
				.of([tuple<['foo', 'bar', 'baz']>([string(), string(), string()])])
				// @ts-expect-error Invalid type
				.validate([1]);
		}).toThrowErrorMatchingInlineSnapshot(`
		"Value must be one of: tuple<string, string, string>. Received array/tuple with the following invalidations:
		  - Must be a string."
	`);
	});

	it('runs correctly for valid values', () => {
		expect(schema.validate('foo')).toBe('foo');
		expect(schema.validate(3)).toBe(3);
		expect(schema.validate(true)).toBe(true);
	});

	it('supports multiple array schemas', () => {
		const arrayUnion = union<number[] | string[]>([]).of([
			array().of(string()),
			array().of(number()),
		]);

		expect(() => {
			// @ts-expect-error Invalid type
			arrayUnion.validate([true]);
		}).toThrowErrorMatchingInlineSnapshot(`
		"Value must be one of: array<string>, array<number>. Received array/tuple with the following invalidations:
		  - Must be a string.
		  - Must be a number."
	`);

		expect(() => {
			arrayUnion.validate([123]);
		}).not.toThrow();

		expect(() => {
			arrayUnion.validate(['abc']);
		}).not.toThrow();
	});

	it('supports multiple object schemas', () => {
		const objectUnion = union<Record<string, number | string>>({}).of([
			object().of(string()),
			object().of(number()),
		]);

		expect(() => {
			// @ts-expect-error Invalid type
			objectUnion.validate({ foo: true });
		}).toThrowErrorMatchingInlineSnapshot(`
		"Value must be one of: object<string>, object<number>. Received object/shape with the following invalidations:
		  - Must be a string.
		  - Must be a number."
	`);

		expect(() => {
			objectUnion.validate({ foo: 123 });
		}).not.toThrow();

		expect(() => {
			objectUnion.validate({ foo: 'abc' });
		}).not.toThrow();
	});

	it('supports arrays and tuples correctly', () => {
		const mixedUnion = union<[string, number][] | string[]>([]).of([
			array().of(string()),
			array().of(tuple<[string, number]>([string(), number()])),
		]);

		expect(mixedUnion.validate(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);

		expect(
			mixedUnion.validate([
				['a', 1],
				['b', 2],
			]),
		).toEqual([
			['a', 1],
			['b', 2],
		]);
	});

	it('supports very complex nested unions', () => {
		const options = union({}).of([bool(), object()]);
		const complexUnion = union({}).of([
			// 'foo'
			// ['foo', true]
			// ['foo', {}]
			array().of(
				union('').of([
					string().notEmpty(),
					tuple<[string, boolean | object]>([string().notEmpty(), options]),
				]),
			),
			// foo: true
			// foo: {}
			object().of(options).notNullable(),
		]);

		// array only
		expect(() => complexUnion.validate([])).not.toThrow();
		expect(() => complexUnion.validate(['a', 'b', 'c'])).not.toThrow();

		// tuple only
		expect(() =>
			complexUnion.validate([
				['a', true],
				['b', false],
				['c', {}],
			]),
		).not.toThrow();

		// arrays and tuples
		expect(() => complexUnion.validate(['a', ['b', false], ['c', {}], 'd'])).not.toThrow();

		// object only
		expect(() => complexUnion.validate({})).not.toThrow();
		expect(() => complexUnion.validate({ a: true, b: false, c: {} })).not.toThrow();

		// invalid
		expect(() => complexUnion.validate(['a', ['b', null], ['c', {}], 'd', 123]))
			.toThrowErrorMatchingInlineSnapshot(`
		"Value must be one of: array<string | tuple<string, boolean | object>>, object<boolean | object>. Received array/tuple with the following invalidations:
		  - Value must be one of: string, tuple<string, boolean | object>. Received array/tuple with the following invalidations:
		  - Null is not allowed."
	`);
		expect(() => complexUnion.validate({ a: true, b: 123, c: {} }))
			.toThrowErrorMatchingInlineSnapshot(`
		"Value must be one of: array<string | tuple<string, boolean | object>>, object<boolean | object>. Received object/shape with the following invalidations:
		  - Value must be one of: boolean, object."
	`);
	});

	it('supports object and shape schemas in parallel', () => {
		const mixedUnion = union<ExampleShape | Record<string, string>>({}).of([
			shape({
				foo: string(),
				bar: number(),
				baz: bool(),
			}).exact(),
			object().of(string()),
		]);

		expect(() => {
			// @ts-expect-error Invalid type
			mixedUnion.validate({ unknown: true });
		}).toThrowErrorMatchingInlineSnapshot(`
		"Value must be one of: shape<{ foo: string, bar: number, baz: boolean }>, object<string>. Received object/shape with the following invalidations:
		  - Unknown fields: unknown.
		  - Must be a string."
	`);

		expect(() => {
			// @ts-expect-error Invalid type
			mixedUnion.validate({ foo: 123 });
		}).toThrowErrorMatchingInlineSnapshot(`
		"Value must be one of: shape<{ foo: string, bar: number, baz: boolean }>, object<string>. Received object/shape with the following invalidations:
		  - Must be a string."
	`);

		expect(() => {
			// @ts-expect-error Invalid type
			mixedUnion.validate({ foo: 'abc', bar: 'abc', baz: 123 });
		}).toThrowErrorMatchingInlineSnapshot(`
		"Value must be one of: shape<{ foo: string, bar: number, baz: boolean }>, object<string>. Received object/shape with the following invalidations:
		  - Must be a number.
		  - Must be a string."
	`);

		expect(() => {
			// @ts-expect-error Invalid type
			mixedUnion.validate({ foo: 'abc', bar: 123 });
		}).not.toThrow();

		expect(() => {
			mixedUnion.validate({ key: 'value' });
		}).not.toThrow();
	});

	it('returns shapes as their full objects', () => {
		const shapesUnion = union<ExampleShape | Record<string, number>>({}).of([
			shape({
				foo: string().required(),
				bar: number(),
				baz: bool(),
			}).exact(),
			object().of(number()),
		]);

		expect(shapesUnion.validate({})).toEqual({});
		// @ts-expect-error Mixed types
		expect(shapesUnion.validate({ foo: 'foo' })).toEqual({
			foo: 'foo',
			bar: 0,
			baz: false,
		});
		expect(shapesUnion.validate({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
	});

	it('returns an array of shapes as their full objects', () => {
		const arrayShapesUnion = union<ExampleShape[]>([]).of([
			array().of(
				shape({
					foo: string(),
					bar: number(),
					baz: bool(),
				}).exact(),
			),
		]);

		expect(arrayShapesUnion.validate([])).toEqual([]);
		// @ts-expect-error Partial types are allowed?
		expect(arrayShapesUnion.validate([{ foo: 'foo' }, { bar: 123 }, { baz: true }])).toEqual([
			{
				foo: 'foo',
				bar: 0,
				baz: false,
			},
			{
				foo: '',
				bar: 123,
				baz: false,
			},
			{
				foo: '',
				bar: 0,
				baz: true,
			},
		]);
	});

	describe('of()', () => {
		it('errors if a non-array is passed', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				union('').of(123);
			}).toThrow('A non-empty array of schemas are required for a union.');
		});

		it('errors if an empty array is passed', () => {
			expect(() => {
				union('').of([]);
			}).toThrow('A non-empty array of schemas are required for a union.');
		});
	});

	describe('type()', () => {
		it('returns list of types', () => {
			expect(schema.type()).toBe(
				'array<string> | boolean | number | Foo | object<number> | string',
			);
		});
	});

	describe('validateType()', () => {
		it('errors if an invalid value is passed', () => {
			expect(() => {
				schema.validate('not a whitelisted string');
			}).toThrowErrorMatchingInlineSnapshot(`
			"Value must be one of: array<string>, boolean, number, Foo, object<number>, string. Received string with the following invalidations:
			  - String must be one of: foo, bar, baz"
		`);
		});

		it('doesnt error if a valid value is passed', () => {
			expect(() => {
				schema.validate('foo');
			}).not.toThrow();
		});

		it('returns passed string', () => {
			expect(schema.validate('foo')).toBe('foo');
		});

		it('returns default value if undefined passed', () => {
			expect(schema.validate(undefined)).toBe('baz');
		});

		it('errors if null is passed', () => {
			expect(() => {
				schema.validate(null);
			}).toThrow('Null is not allowed.');
		});
	});
});
