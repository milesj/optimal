import { bool, number, shape, ShapeSchema, string } from '../../src';
import { runInProd } from '../helpers';
import { runCommonTests } from './runCommonTests';

describe('shape()', () => {
	let schema: ShapeSchema<{
		foo: string;
		bar: number;
		baz: boolean;
	}>;

	beforeEach(() => {
		schema = shape({
			foo: string(),
			bar: number(),
			baz: bool(),
		});
	});

	runCommonTests(
		// @ts-expect-error Shape mismatch
		(defaultValue) => shape(defaultValue),
		{
			foo: 'abc',
			bar: 123,
			baz: true,
		},
		{
			defaultValue: {
				foo: string(),
				bar: number(),
				baz: bool(),
			},
			skipDefaultAsserts: true,
		},
	);

	describe('exact()', () => {
		beforeEach(() => {
			schema.exact();
		});

		it('errors if unknown properties passed', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				schema.validate({ foo: '', bar: 0, baz: true, qux: 'unknown' });
			}).toThrow('Unknown fields: qux.');
		});

		it('doesnt error if exact properties', () => {
			expect(() => {
				schema.validate({ foo: '', bar: 0, baz: true });
			}).not.toThrow();
		});

		describe('production', () => {
			it(
				'errors if less properties',
				runInProd(() => {
					expect(() => {
						schema.validate({});
					}).not.toThrow();
				}),
			);
		});
	});

	describe('type()', () => {
		it('returns "shape" with subtype', () => {
			expect(
				shape({
					foo: string(),
					bar: number(),
					baz: bool(),
				}).type(),
			).toBe('shape<{ foo: string, bar: number, baz: boolean }>');
		});
	});

	describe('validateType()', () => {
		it('doesnt error if an shape is passed', () => {
			expect(() => {
				schema.validate({ foo: 'bar' });
			}).not.toThrow();
		});

		it('returns passed shape', () => {
			expect(schema.validate({ foo: 'xyz' })).toEqual({ foo: 'xyz', bar: 0, baz: false });
		});

		it('returns built value if undefined passed', () => {
			expect(schema.validate(undefined)).toEqual({ foo: '', bar: 0, baz: false });
		});

		it('errors if null is passed', () => {
			expect(() => {
				schema.validate(null);
			}).toThrow('Null is not allowed.');
		});

		it('errors if a non-shape is passed', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				schema.validate(123);
			}).toThrow('Must be a shaped object.');
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
