import { AnySchema, lazy, LazySchema, number, shape, string } from '../../src';

describe('lazy()', () => {
	let schema: LazySchema<string>;

	beforeEach(() => {
		schema = lazy(() => string().camelCase(), '');
	});

	it('errors if a non-function is passed', () => {
		expect(() => {
			// @ts-expect-error Invalid type
			lazy(123);
		}).toThrow('Lazy requires a schema factory function.');
	});

	describe('cycles', () => {
		interface Node {
			id: number;
			child?: Node | null;
		}

		const node: LazySchema<Node> = shape({
			id: number(),
			child: lazy(() => node, null).nullable(),
		});

		it('can handle self-referencing nodes', () => {
			expect(() => {
				node.validate({
					id: 1,
				});
			}).not.toThrow();

			expect(() => {
				node.validate({
					id: 1,
					child: {
						id: 2,
						child: {
							id: 3,
						},
					},
				});
			}).not.toThrow();
		});

		it('handles undefined nodes', () => {
			expect(
				node.validate({
					id: 1,
					child: {
						id: 2,
						child: undefined,
					},
				}),
			).toEqual({
				id: 1,
				child: {
					id: 2,
					child: null,
				},
			});
		});

		it('handles null nodes', () => {
			expect(
				node.validate({
					id: 1,
					child: {
						id: 2,
						child: null,
					},
				}),
			).toEqual({
				id: 1,
				child: {
					id: 2,
					child: null,
				},
			});
		});

		it('returns the default value if undefined is passed', () => {
			expect(node.validate(undefined)).toEqual({ id: 0, child: null });
		});

		it('doesnt evaluate if undefined', () => {
			let count = 0;

			const evalNode: LazySchema<Node> = shape({
				id: number(),
				child: lazy(() => {
					count += 1;
					return evalNode;
				}, null).nullable(),
			});

			evalNode.validate({ id: 1 });

			expect(count).toBe(0);
		});
	});

	describe('type()', () => {
		it('returns "lazy" type', () => {
			expect(schema.type()).toBe('lazy');
		});
	});

	describe('validateType()', () => {
		it('errors if a non-schema is returned', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				schema = lazy(() => 123);
				schema.validate('abc');
			}).toThrow('Factory must return a schema.');
		});

		it('errors if valid values the lazy schema', () => {
			expect(() => {
				schema.validate(123);
			}).toThrow('Must be a string.');

			expect(() => {
				schema.validate('a-b');
			}).toThrow('String must be in camel case. (pattern "^[a-z][a-zA-Z0-9]+$")');
		});

		it('errors if null is passed', () => {
			expect(() => {
				schema.validate(null);
			}).toThrow('Null is not allowed.');
		});
	});
});
