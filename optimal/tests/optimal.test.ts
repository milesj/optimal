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
			optimal(blueprint, 123);
		}).toThrowErrorMatchingInlineSnapshot(`"Optimal options must be a plain object."`);
	});

	it('errors if a non-object config is passed to configure', () => {
		expect(() => {
			// @ts-expect-error Invalid type
			optimal(blueprint).configure(123);
		}).toThrowErrorMatchingInlineSnapshot(`"Optimal options must be a plain object."`);
	});

	it('sets object keys as class properties', () => {
		const options = optimal({
			foo: number(0),
			bar: bool(true),
			baz: string(),
		}).validate({
			foo: 123,
			bar: true,
		});

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
		const options = optimal(blueprint).validate({});

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
			optimal(blueprint).validate({
				// @ts-expect-error Invalid type
				entry: 123,
			});
		}).toThrowErrorMatchingInlineSnapshot(`
		"The following validations have failed:
		  - Invalid field \\"entry\\". Value must be one of: string, array<string>, object<string | array<string>>, function."
	`);
	});

	it('runs checks for nested level values', () => {
		expect(() => {
			optimal(blueprint).validate({
				output: {
					// @ts-expect-error Invalid type
					crossOriginLoading: 'not-anonymous',
				},
			});
		}).toThrowErrorMatchingInlineSnapshot(`
		"The following validations have failed:
		  - Invalid field \\"output.crossOriginLoading\\". Value must be one of: boolean, string. Received string with the following invalidations:
		    - Invalid field \\"output.crossOriginLoading\\". String must be one of: anonymous, use-credentials"
	`);
	});

	it('includes a custom `name` in the error message', () => {
		expect(() => {
			optimal(blueprint, {
				name: 'FooBar',
			}).validate({
				// @ts-expect-error Invalid type
				entry: 123,
			});
		}).toThrowErrorMatchingInlineSnapshot(`
		"The following validations have failed:
		  - Invalid field \\"entry\\". Value must be one of: string, array<string>, object<string | array<string>>, function."
	`);
	});

	describe('production', () => {
		it(
			'sets and returns correct properties',
			runInProd(() => {
				const options = optimal(blueprint).validate({
					entry: ['foo.js'],
					output: {
						hashFunction: 'sha256',
					},
					module: {
						noParse: /foo/u,
					},
					// @ts-expect-error Invalid type
					target: 'unknown',
				});

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
				optimal(blueprint).validate({
					// @ts-expect-error Unknown
					foo: 123,
					bar: 456,
				});
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - Unknown fields: foo, bar."
		`);
		});

		it('doesnt error for unknown fields if `unknown` is true', () => {
			expect(() => {
				optimal(blueprint, {
					unknown: true,
				}).validate({
					// @ts-expect-error Unknown
					foo: 123,
					bar: 456,
				});
			}).not.toThrow();
		});

		it('sets unknown fields', () => {
			expect(
				optimal(blueprint, {
					unknown: true,
				}).validate({
					// @ts-expect-error Unknown
					foo: 123,
					bar: 456,
				}),
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
				optimal({
					foo: string('a').and('bar', 'baz'),
					bar: string('b').and('foo', 'baz'),
					baz: string('c').and('foo', 'bar'),
				}).validate({});
			}).not.toThrow();

			expect(() => {
				optimal(and).validate({
					foo: 'a',
				});
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - All of these fields must be defined: foo, bar, baz"
		`);

			expect(() => {
				optimal(and).validate({
					foo: 'a',
					bar: 'b',
				});
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - All of these fields must be defined: foo, bar, baz"
		`);

			expect(() => {
				optimal(and).validate({
					foo: 'a',
					baz: 'c',
				});
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - All of these fields must be defined: foo, bar, baz"
		`);

			expect(() => {
				optimal(and).validate({
					foo: 'a',
					bar: 'b',
					baz: 'c',
				});
			}).not.toThrow();
		});

		it('handles OR', () => {
			const or = {
				foo: string('a').or('bar', 'baz'),
				bar: string('b').or('foo', 'baz'),
				baz: string('c').or('foo', 'bar'),
			};

			expect(() => {
				optimal(or).validate({});
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - At least one of these fields must be defined: foo, bar, baz"
		`);

			expect(() => {
				optimal(or).validate({
					foo: 'a',
				});
			}).not.toThrow();

			expect(() => {
				optimal(or).validate({
					bar: 'b',
				});
			}).not.toThrow();

			expect(() => {
				optimal(or).validate({
					baz: 'c',
				});
			}).not.toThrow();

			expect(() => {
				optimal(or).validate({
					foo: 'a',
					bar: 'b',
					baz: 'c',
				});
			}).not.toThrow();
		});

		it('handles XOR', () => {
			const xor = {
				foo: string('a').xor('bar', 'baz'),
				bar: string('b').xor('foo', 'baz'),
				baz: string('c').xor('foo', 'bar'),
			};

			expect(() => {
				optimal(xor).validate({});
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - Only one of these fields may be defined: foo, bar, baz"
		`);

			expect(() => {
				optimal(xor).validate({
					foo: 'a',
				});
			}).not.toThrow();

			expect(() => {
				optimal(xor).validate({
					bar: 'b',
				});
			}).not.toThrow();

			expect(() => {
				optimal(xor).validate({
					baz: 'c',
				});
			}).not.toThrow();

			expect(() => {
				optimal(xor).validate({
					foo: 'a',
					bar: 'b',
					baz: 'c',
				});
			}).toThrowErrorMatchingInlineSnapshot(`
			"The following validations have failed:
			  - Only one of these fields may be defined: foo, bar, baz"
		`);
		});
	});
});
