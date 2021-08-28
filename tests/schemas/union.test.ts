import {
	array,
	bool,
	custom,
	instance,
	number,
	object,
	shape,
	string,
	tuple,
	union,
	UnionSchema,
} from '../../src';
import { runInProd } from '../helpers';
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
		schema = union<Union>(
			[
				array().of(string()),
				bool(true).onlyTrue(),
				number().between(0, 5),
				instance().of(Foo),
				object().of(number()),
				string('foo').oneOf(['foo', 'bar', 'baz']),
			],
			'baz',
		);
	});

	runCommonTests<Union>(
		(defaultValue) =>
			union<Union>(
				[
					array().of(string()),
					bool(true).onlyTrue(),
					number().between(0, 5),
					instance().of(Foo),
					object().of(number()),
					string('foo').oneOf(['foo', 'bar', 'baz']),
				],
				defaultValue!,
			),
		'baz',
		{
			defaultValue: 1,
		},
	);

	it('errors if a unsupported type is used', () => {
		expect(() => {
			union<boolean | number | string>([bool(), number(), string()], 0)
				// @ts-expect-error Invalid type
				.validate({});
		}).toThrowErrorMatchingInlineSnapshot(`"Value must be one of: boolean, number, string."`);
	});

	it('errors if a nested union is used', () => {
		expect(() => {
			union<string[]>([string('foo'), union([number(), bool()], [])], []).validate([]);
		}).toThrowErrorMatchingInlineSnapshot(`"Nested unions are not supported."`);
	});

	it('errors with the class name for instance checks', () => {
		expect(() => {
			union<Buffer | number | null>([number(), instance().of(Buffer)], 0)
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
       - Invalid field \\"[0]\\". Must be a string."
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
			union(
				[
					string(),
					custom((value) => {
						if (typeof value === 'number') {
							throw new TypeError('Encountered a number!');
						}
					}, ''),
				],
				0,
			).validate(123);
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
       - Invalid field \\"foo\\". Must be a number."
    `);
	});

	it('runs shape check', () => {
		expect(() => {
			union(
				[
					shape({
						foo: string(),
						bar: number(),
					}),
				],
				{ foo: '', bar: 0 },
				// @ts-expect-error Invalid type
			).validate({ foo: 123 });
		}).toThrowErrorMatchingInlineSnapshot(`
      "Value must be one of: shape<{ foo: string, bar: number }>. Received object/shape with the following invalidations:
       - Invalid field \\"foo\\". Must be a string."
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
			union(
				[tuple<['foo', 'bar', 'baz']>([string(), string(), string()])],
				['foo', 'bar', 'baz'],
				// @ts-expect-error Invalid type
			).validate([1]);
		}).toThrowErrorMatchingInlineSnapshot(`
      "Value must be one of: tuple<string, string, string>. Received array/tuple with the following invalidations:
       - Invalid field \\"[0]\\". Must be a string."
    `);
	});

	it('runs correctly for valid values', () => {
		expect(schema.validate('foo')).toBe('foo');
		expect(schema.validate(3)).toBe(3);
		expect(schema.validate(true)).toBe(true);
	});

	it('supports multiple array schemas', () => {
		const arrayUnion = union<number[] | string[]>([array().of(string()), array().of(number())], []);

		expect(() => {
			// @ts-expect-error Invalid type
			arrayUnion.validate([true]);
		}).toThrowErrorMatchingInlineSnapshot(`
      "Value must be one of: array<string>, array<number>. Received array/tuple with the following invalidations:
       - Invalid field \\"[0]\\". Must be a string.
       - Invalid field \\"[0]\\". Must be a number."
    `);

		expect(() => {
			arrayUnion.validate([123]);
		}).not.toThrow();

		expect(() => {
			arrayUnion.validate(['abc']);
		}).not.toThrow();
	});

	it('supports multiple object schemas', () => {
		const objectUnion = union<Record<string, number | string>>(
			[object().of(string()), object().of(number())],
			{},
		);

		expect(() => {
			// @ts-expect-error Invalid type
			objectUnion.validate({ foo: true });
		}).toThrowErrorMatchingInlineSnapshot(`
      "Value must be one of: object<string>, object<number>. Received object/shape with the following invalidations:
       - Invalid field \\"foo\\". Must be a string.
       - Invalid field \\"foo\\". Must be a number."
    `);

		expect(() => {
			objectUnion.validate({ foo: 123 });
		}).not.toThrow();

		expect(() => {
			objectUnion.validate({ foo: 'abc' });
		}).not.toThrow();
	});

	it('supports arrays and tuples correctly', () => {
		const mixedUnion = union<[string, number][] | string[]>(
			[array().of(string()), array().of(tuple<[string, number]>([string(), number()]))],
			[],
		);

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
		const options = union([bool(), object()], {});
		const complexUnion = union(
			[
				// 'foo'
				// ['foo', true]
				// ['foo', {}]
				array().of(
					union(
						[
							string().notEmpty(),
							tuple<[string, boolean | object]>([string().notEmpty(), options]),
						],
						'',
					),
				),
				// foo: true
				// foo: {}
				object().of(options).notNullable(),
			],
			{},
		);

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
       - Invalid field \\"[1]\\". Value must be one of: string, tuple<string, boolean | object>. Received array/tuple with the following invalidations:
       - Invalid field \\"[1][1]\\". Null is not allowed."
    `);
		expect(() => complexUnion.validate({ a: true, b: 123, c: {} }))
			.toThrowErrorMatchingInlineSnapshot(`
      "Value must be one of: array<string | tuple<string, boolean | object>>, object<boolean | object>. Received object/shape with the following invalidations:
       - Invalid field \\"b\\". Value must be one of: boolean, object."
    `);
	});

	it('supports object and shape schemas in parallel', () => {
		const mixedUnion = union<ExampleShape | Record<string, string>>(
			[
				shape({
					foo: string(),
					bar: number(),
					baz: bool(),
				}).exact(),
				object().of(string()),
			],
			{},
		);

		expect(() => {
			// @ts-expect-error Invalid type
			mixedUnion.validate({ unknown: true });
		}).toThrowErrorMatchingInlineSnapshot(`
      "Value must be one of: shape<{ foo: string, bar: number, baz: boolean }>, object<string>. Received object/shape with the following invalidations:
       - Unknown fields: unknown.
       - Invalid field \\"unknown\\". Must be a string."
    `);

		expect(() => {
			// @ts-expect-error Invalid type
			mixedUnion.validate({ foo: 123 });
		}).toThrowErrorMatchingInlineSnapshot(`
      "Value must be one of: shape<{ foo: string, bar: number, baz: boolean }>, object<string>. Received object/shape with the following invalidations:
       - Invalid field \\"foo\\". Must be a string."
    `);

		expect(() => {
			// @ts-expect-error Invalid type
			mixedUnion.validate({ foo: 'abc', bar: 'abc', baz: 123 });
		}).toThrowErrorMatchingInlineSnapshot(`
      "Value must be one of: shape<{ foo: string, bar: number, baz: boolean }>, object<string>. Received object/shape with the following invalidations:
       - Invalid field \\"bar\\". Must be a number.
       - Invalid field \\"baz\\". Must be a string."
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
		const shapesUnion = union<ExampleShape | Record<string, number>>(
			[
				shape({
					foo: string().required(),
					bar: number(),
					baz: bool(),
				}).exact(),
				object().of(number()),
			],
			{},
		);

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
		const arrayShapesUnion = union<ExampleShape[]>(
			[
				array().of(
					shape({
						foo: string(),
						bar: number(),
						baz: bool(),
					}).exact(),
				),
			],
			[],
		);

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

	describe('type()', () => {
		it('returns list of types', () => {
			expect(schema.type()).toBe(
				'array<string> | boolean | number | Foo | object<number> | string',
			);
		});
	});

	describe('validateType()', () => {
		it('errors if a non-array is passed', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				union(123);
			}).toThrow('A non-empty array of schemas are required for a union.');
		});

		it('errors if an empty array is passed', () => {
			expect(() => {
				union([], '');
			}).toThrow('A non-empty array of schemas are required for a union.');
		});

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

		describe('production', () => {
			it(
				'doesnt error if a non-string is passed',
				runInProd(() => {
					expect(() => {
						schema.validate('invalid string');
					}).not.toThrow();
				}),
			);
		});
	});
});
