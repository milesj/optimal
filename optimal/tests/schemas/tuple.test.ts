import { array, bool, number, object, string, tuple, TupleSchema } from '../../src';
import { runInProd } from '../helpers';
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

	runCommonTests<Tuple>(
		(defaultValue) =>
			tuple(
				[
					array().of(string()),
					bool(true),
					number(1).between(0, 5),
					object().of(number()),
					string('foo').oneOf(['foo', 'bar', 'baz']),
				],
				defaultValue,
			),
		[['a', 'b', 'c'], true, 3, { a: 1 }, 'baz'],
		{
			defaultValue: [[], false, 1, {}, 'foo'],
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
				// @ts-expect-error Invalid type
				schema.validate(123);
			}).toThrow('Must be a tuple.');
		});

		it('errors if the first tuple item is invalid', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				schema.validate([null, false, 4, {}, 'foo']);
			}).toThrow('Invalid field "[0]". Null is not allowed.');
		});

		it('errors if a middle tuple item is invalid', () => {
			expect(() => {
				schema.validate([[], false, -10, {}, 'bar']);
			}).toThrow('Invalid field "[2]". Number must be between 0 and 5.');
		});

		it('errors if the last tuple item is invalid', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				schema.validate([[], false, 4, {}, 'qux']);
			}).toThrow('Invalid field "[4]". String must be one of: foo, bar, baz');
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

		describe('production', () => {
			it(
				'doesnt error if a non-tuple is passed',
				runInProd(() => {
					expect(() => {
						// @ts-expect-error Invalid type
						schema.validate({});
					}).not.toThrow();
				}),
			);
		});
	});
});
