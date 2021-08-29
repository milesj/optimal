import {
	array,
	bool,
	func,
	Infer,
	instance,
	number,
	object,
	optimal,
	regex,
	shape,
	string,
	union,
} from '../src';
import { runInProd } from './helpers';

class Plugin {}

describe('Optimal', () => {
	type PrimitiveType = boolean | number | string;
	type ConditionType = Function | Record<string, RegExp> | RegExp | RegExp[] | string;

	// This blueprint is based on Webpack's configuration: https://webpack.js.org/configuration/
	// Webpack provides a pretty robust example of how to use this library.
	const primitive = union<PrimitiveType>(false).of([string(), number(), bool()]);
	type PrimitiveTest = Infer<typeof primitive>;

	const condition = union<ConditionType>('').of([
		string(),
		func(),
		regex(),
		array().of(regex()),
		object().of(regex()),
	]);
	type ConditionTest = Infer<typeof condition>;

	const rule = shape({
		enforce: string('post').oneOf<'post' | 'pre'>(['pre', 'post']),
		exclude: condition,
		include: condition,
		issuer: condition,
		parser: object().of(bool()),
		resource: condition,
		use: array().of(
			union<object | string>([]).of([
				string(),
				shape({
					loader: string(),
					options: object(primitive),
				}),
			]),
		),
	});
	type RuleTest = Infer<typeof rule>;

	type EntryType = Function | Record<string, string[] | string> | string[] | string;
	type CrossOriginType = 'anonymous' | 'use-credentials';
	type HashType = 'md5' | 'sha256' | 'sha512';
	type NoParseType = Function | RegExp | RegExp[];
	type TargetType =
		| 'async-node'
		| 'electron-main'
		| 'electron-renderer'
		| 'node-webkit'
		| 'node'
		| 'web'
		| 'webworker';
	type NodeType = 'empty' | 'mock';

	const blueprint = {
		context: string(process.cwd()),
		entry: union<EntryType>([])
			.of([
				string(),
				array().of(string()),
				object().of(union('').of([string(), array().of(string())])),
				func(),
			])
			.nullable(),
		output: shape({
			chunkFilename: string('[id].js'),
			chunkLoadTimeout: number(120_000),
			crossOriginLoading: union<CrossOriginType | false>(false).of([
				bool(false).only(),
				string('anonymous').oneOf<CrossOriginType>(['anonymous', 'use-credentials']),
			]),
			filename: string('bundle.js'),
			hashFunction: string('md5').oneOf<HashType>(['md5', 'sha256', 'sha512']),
			path: string(),
			publicPath: string(),
		}),
		module: shape({
			noParse: union<NoParseType | null>(null)
				.of([regex(), array().of(regex()), func()])
				.nullable(),
			rules: array().of(rule),
		}),
		resolve: shape({
			alias: object().of(string()),
			extensions: array().of(string()),
			plugins: array().of(instance().of(Plugin)),
			resolveLoader: object().of(array().of(string())),
		}),
		plugins: array().of(instance().of(Plugin)),
		target: string('web').oneOf<TargetType>([
			'async-node',
			'electron-main',
			'electron-renderer',
			'node',
			'node-webkit',
			'web',
			'webworker',
		]),
		watch: bool(false),
		node: object().of(
			union<NodeType | boolean>(false).of([
				bool(),
				string('mock').oneOf<NodeType>(['mock', 'empty']),
			]),
		),
	};
	type BlueprintTest = Infer<typeof blueprint>;

	const blueprintList = [primitive, condition, rule];
	type BlueprintListTest = Infer<typeof blueprintList>;

	it('errors if a non-object is passed', () => {
		expect(() => {
			optimal([], {});
		}).toThrowErrorMatchingInlineSnapshot(
			`"A non-empty object of schemas are required for a shape."`,
		);

		expect(() => {
			// @ts-expect-error Invalid type
			optimal(123, {});
		}).toThrowErrorMatchingInlineSnapshot(
			`"A non-empty object of schemas are required for a shape."`,
		);

		expect(() => {
			// @ts-expect-error Invalid type
			optimal('foo', {});
		}).toThrowErrorMatchingInlineSnapshot(
			`"A non-empty object of schemas are required for a shape."`,
		);

		expect(() => {
			optimal(() => {}, {});
		}).toThrowErrorMatchingInlineSnapshot(
			`"A non-empty object of schemas are required for a shape."`,
		);
	});

	it('errors if a non-object is passed as a blueprint', () => {
		expect(() => {
			// @ts-expect-error Invalid type
			optimal({}, 123);
		}).toThrowErrorMatchingInlineSnapshot(
			`"A non-empty object of schemas are required for a shape."`,
		);
	});

	it('errors if a non-schema is passed within the blueprint', () => {
		expect(() => {
			optimal(
				{},
				{
					// @ts-expect-error Invalid type
					foo: 123,
				},
			);
		}).toThrowErrorMatchingInlineSnapshot(
			`"A non-empty object of schemas are required for a shape."`,
		);
	});

	it('errors if a non-object config is passed', () => {
		expect(() => {
			// @ts-expect-error Invalid type
			optimal({}, blueprint, 123);
		}).toThrowErrorMatchingInlineSnapshot(`"Optimal options must be a plain object."`);
	});

	it('sets object keys as class properties', () => {
		const options = optimal<{
			foo: number;
			bar: boolean;
			baz: string;
		}>(
			{
				foo: 123,
				bar: true,
			},
			{
				foo: number(0),
				bar: bool(true),
				baz: string(),
			},
		);

		expect(options.foo).toBe(123);
		expect(options.bar).toBe(true);
		expect(options.baz).toBe('');
		expect(options).toEqual({
			foo: 123,
			bar: true,
			baz: '',
		});
	});

	it('sets default values', () => {
		const options = optimal({}, blueprint);

		expect(options).toEqual({
			context: process.cwd(),
			entry: [],
			output: {
				chunkFilename: '[id].js',
				chunkLoadTimeout: 120_000,
				crossOriginLoading: false,
				filename: 'bundle.js',
				hashFunction: 'md5',
				path: '',
				publicPath: '',
			},
			module: {
				noParse: null,
				rules: [],
			},
			resolve: {
				alias: {},
				extensions: [],
				plugins: [],
				resolveLoader: {},
			},
			plugins: [],
			target: 'web',
			watch: false,
			node: {},
		});
	});

	it('runs checks for root level values', () => {
		expect(() => {
			optimal(
				{
					entry: 123,
				},
				blueprint,
			);
		}).toThrowErrorMatchingInlineSnapshot(
			`"Invalid field \\"entry\\". Value must be one of: string, array<string>, object<string | array<string>>, function."`,
		);
	});

	it('runs checks for nested level values', () => {
		expect(() => {
			optimal(
				{
					output: {
						crossOriginLoading: 'not-anonymous',
					},
				},
				blueprint,
			);
		}).toThrowErrorMatchingInlineSnapshot(`
      "Invalid field \\"output.crossOriginLoading\\". Value must be one of: boolean, string. Received string with the following invalidations:
       - Invalid field \\"output.crossOriginLoading\\". String must be one of: anonymous, use-credentials"
    `);
	});

	it('includes a custom `name` in the error message', () => {
		expect(() => {
			optimal(
				{
					entry: 123,
				},
				blueprint,
				{
					name: 'FooBar',
				},
			);
		}).toThrowErrorMatchingInlineSnapshot(
			`"Invalid field \\"entry\\". Value must be one of: string, array<string>, object<string | array<string>>, function."`,
		);
	});

	describe('production', () => {
		it(
			'sets and returns correct properties',
			runInProd(() => {
				const options = optimal(
					{
						entry: ['foo.js'],
						output: {
							hashFunction: 'sha256',
						},
						module: {
							noParse: /foo/u,
						},
						// Invalid, should not error
						target: 'unknown',
					},
					blueprint,
				);

				expect(options).toEqual({
					context: process.cwd(),
					entry: ['foo.js'],
					output: {
						chunkFilename: '[id].js',
						chunkLoadTimeout: 120_000,
						crossOriginLoading: false,
						filename: 'bundle.js',
						hashFunction: 'sha256',
						path: '',
						publicPath: '',
					},
					module: {
						noParse: /foo/u,
						rules: [],
					},
					resolve: {
						alias: {},
						extensions: [],
						plugins: [],
						resolveLoader: {},
					},
					plugins: [],
					target: 'unknown',
					watch: false,
					node: {},
				});
			}),
		);
	});

	describe('unknown fields', () => {
		it('errors for unknown fields', () => {
			expect(() => {
				optimal(
					{
						foo: 123,
						bar: 456,
					},
					blueprint,
				);
			}).toThrowErrorMatchingInlineSnapshot(`"Unknown fields: foo, bar."`);
		});

		it('doesnt error for unknown fields if `unknown` is true', () => {
			expect(() => {
				optimal(
					{
						foo: 123,
						bar: 456,
					},
					blueprint,
					{
						unknown: true,
					},
				);
			}).not.toThrow();
		});

		it('sets unknown fields', () => {
			expect(
				optimal(
					{
						foo: 123,
						bar: 456,
					},
					blueprint,
					{
						unknown: true,
					},
				),
			).toEqual(
				expect.objectContaining({
					foo: 123,
					bar: 456,
				}),
			);
		});
	});

	describe('logical operators', () => {
		it('handles AND', () => {
			const and = {
				foo: string('a').and('bar', 'baz'),
				bar: string('b').and('foo', 'baz'),
				baz: string('c').and('foo', 'bar'),
			};

			// Dont error if all are undefined
			expect(() => {
				optimal(
					{},
					{
						foo: string('a').and('bar', 'baz'),
						bar: string('b').and('foo', 'baz'),
						baz: string('c').and('foo', 'bar'),
					},
				);
			}).not.toThrow();

			expect(() => {
				optimal(
					{
						foo: 'a',
					},
					and,
				);
			}).toThrowErrorMatchingInlineSnapshot(`"All of these fields must be defined: foo, bar, baz"`);

			expect(() => {
				optimal(
					{
						foo: 'a',
						bar: 'b',
					},
					and,
				);
			}).toThrowErrorMatchingInlineSnapshot(`"All of these fields must be defined: foo, bar, baz"`);

			expect(() => {
				optimal(
					{
						foo: 'a',
						baz: 'c',
					},
					and,
				);
			}).toThrowErrorMatchingInlineSnapshot(`"All of these fields must be defined: foo, bar, baz"`);

			expect(() => {
				optimal(
					{
						foo: 'a',
						bar: 'b',
						baz: 'c',
					},
					and,
				);
			}).not.toThrow();
		});

		it('handles OR', () => {
			const or = {
				foo: string('a').or('bar', 'baz'),
				bar: string('b').or('foo', 'baz'),
				baz: string('c').or('foo', 'bar'),
			};

			expect(() => {
				optimal({}, or);
			}).toThrowErrorMatchingInlineSnapshot(
				`"At least one of these fields must be defined: foo, bar, baz"`,
			);

			expect(() => {
				optimal(
					{
						foo: 'a',
					},
					or,
				);
			}).not.toThrow();

			expect(() => {
				optimal(
					{
						bar: 'b',
					},
					or,
				);
			}).not.toThrow();

			expect(() => {
				optimal(
					{
						baz: 'c',
					},
					or,
				);
			}).not.toThrow();

			expect(() => {
				optimal(
					{
						foo: 'a',
						bar: 'b',
						baz: 'c',
					},
					or,
				);
			}).not.toThrow();
		});

		it('handles XOR', () => {
			const xor = {
				foo: string('a').xor('bar', 'baz'),
				bar: string('b').xor('foo', 'baz'),
				baz: string('c').xor('foo', 'bar'),
			};

			expect(() => {
				optimal({}, xor);
			}).toThrowErrorMatchingInlineSnapshot(
				`"Only one of these fields may be defined: foo, bar, baz"`,
			);

			expect(() => {
				optimal(
					{
						foo: 'a',
					},
					xor,
				);
			}).not.toThrow();

			expect(() => {
				optimal(
					{
						bar: 'b',
					},
					xor,
				);
			}).not.toThrow();

			expect(() => {
				optimal(
					{
						baz: 'c',
					},
					xor,
				);
			}).not.toThrow();

			expect(() => {
				optimal(
					{
						foo: 'a',
						bar: 'b',
						baz: 'c',
					},
					xor,
				);
			}).toThrowErrorMatchingInlineSnapshot(
				`"Only one of these fields may be defined: foo, bar, baz"`,
			);
		});
	});
});
