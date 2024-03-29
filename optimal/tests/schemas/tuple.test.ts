import { array, bool, Infer, number, object, string, tuple, TupleSchema } from '../../src';
import { runCommonTests } from './runCommonTests';

describe('tuple()', () => {
	type TupleStrings = 'bar' | 'baz' | 'foo';
	type Tuple = [string[], boolean, number, Record<string, number>, TupleStrings];
	let schema: TupleSchema<Tuple>;

	beforeEach(() => {
		schema = tuple([
			array().of(string()),
			bool(true),
			number(1).between(0, 5),
			object().of(number()),
			string('foo').oneOf(['foo', 'bar', 'baz']),
		]);
	});

	type AllTuple = Infer<typeof schema>;

	runCommonTests<Tuple>(
		() =>
			tuple([
				array().of(string()),
				bool(true),
				number(1).between(0, 5),
				object().of(number()),
				string('foo').oneOf(['foo', 'bar', 'baz']),
			]),
		[['a', 'b', 'c'], true, 3, { a: 1 }, 'baz'],
		{
			defaultValue: [[], true, 1, {}, 'foo'],
			skipDefaultAsserts: true,
		},
	);

	it('errors if an empty array is passed', () => {
		expect(() => {
			tuple([]);
		}).toThrow('A non-empty array of schemas are required for a tuple.');
	});

	it('errors if an array with non-schemas is passed', () => {
		expect(() => {
			tuple([
				// @ts-expect-error Invalid type
				123,
			]);
		}).toThrow('A non-empty array of schemas are required for a tuple.');
	});

	describe('type()', () => {
		it('returns "tuple"', () => {
			expect(schema.type()).toBe('tuple<array<string>, boolean, number, object<number>, string>');
		});
	});

	describe('validateType()', () => {
		it('errors if a non-tuple is passed', () => {
			expect(() => {
				schema.validate(123);
			}).toThrow('Must be a tuple, received number.');
		});

		it('errors if the first tuple item is invalid', () => {
			expect(() => {
				schema.validate([null, false, 4, {}, 'foo']);
			}).toThrow('Null is not allowed.');
		});

		it('errors if a middle tuple item is invalid', () => {
			expect(() => {
				schema.validate([[], false, -10, {}, 'bar']);
			}).toThrow('Number must be between 0 and 5, received -10.');
		});

		it('errors if the last tuple item is invalid', () => {
			expect(() => {
				schema.validate([[], false, 4, {}, 'qux']);
			}).toThrow('String must be one of: foo, bar, baz. Received "qux".');
		});

		it('errors if multiple tuple items are invalid', () => {
			expect(() => {
				schema.validate([null, true, -10, {}, 'qux']);
			}).toThrowErrorMatchingInlineSnapshot(`
			"- Invalid member \\"[0]\\". Null is not allowed.
			- Invalid member \\"[2]\\". Number must be between 0 and 5, received -10.
			- Invalid member \\"[4]\\". String must be one of: foo, bar, baz. Received \\"qux\\"."
		`);
		});

		it('doesnt error if a matching tuple is passed', () => {
			expect(() => {
				schema.validate([[], false, 4, {}, 'foo']);
			}).not.toThrow();
		});

		it('errors if null is passed', () => {
			expect(() => {
				schema.validate(null);
			}).toThrow('Null is not allowed.');
		});

		it('returns the default value from its items when undefined is passed', () => {
			expect(schema.validate(undefined)).toEqual([[], true, 1, {}, 'foo']);

			const testSchema = tuple<Tuple>([
				array(['abc']).of(string()),
				bool(true),
				number(3).between(0, 5),
				object({ foo: 123 }).of(number()),
				string('baz').oneOf(['foo', 'bar', 'baz']),
			]);

			expect(testSchema.validate(undefined)).toEqual([['abc'], true, 3, { foo: 123 }, 'baz']);
		});

		it('returns the default value from its items when an empty array is passed', () => {
			expect(schema.validate([])).toEqual([[], true, 1, {}, 'foo']);
		});
	});
});
