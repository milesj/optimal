import { bool, Infer, number, shape, ShapeSchema, string } from '../../src';
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

	const shapeShape = shape({
		foo: string(),
		bar: shape({
			baz: number(),
			qux: shape({
				wow: bool(),
			}),
		}),
	});

	type BaseShape = Infer<typeof schema>;
	type ShapeShape = Infer<typeof shapeShape>;

	runCommonTests(
		() =>
			shape({
				foo: string(),
				bar: number(),
				baz: bool(),
			}),
		{
			foo: 'abc',
			bar: 123,
			baz: true,
		},
		{
			defaultValue: {
				foo: '',
				bar: 0,
				baz: false,
			},
			skipDefaultAsserts: true,
		},
	);

	describe('exact()', () => {
		let exactSchema: typeof schema;

		beforeEach(() => {
			exactSchema = schema.exact();
		});

		it('errors if unknown properties passed', () => {
			expect(() => {
				exactSchema.validate({ foo: '', bar: 0, baz: true, qux: 'unknown' });
			}).toThrow('Unknown fields: qux.');
		});

		it('doesnt error if exact properties', () => {
			expect(() => {
				exactSchema.validate({ foo: '', bar: 0, baz: true });
			}).not.toThrow();
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
				schema.validate(123);
			}).toThrow('Must be a shaped object, received number.');
		});
	});
});
