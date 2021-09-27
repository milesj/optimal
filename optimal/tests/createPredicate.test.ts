import { createPredicate, number } from '../src';

describe('createPredicate()', () => {
	const pred = createPredicate(number());

	it('returns true if the schema passes', () => {
		expect(pred(123)).toBe(true);
	});

	it('returns false if the schema fails', () => {
		// @ts-expect-error Invalid type
		expect(pred('abc')).toBe(false);
	});

	describe('nullable', () => {
		it('returns true if the schema is nullable and null is passed', () => {
			const predNull = createPredicate(number().nullable());

			expect(predNull(null)).toBe(true);
			expect(predNull(123)).toBe(true);
		});

		it('returns false if the schema is not nullable and null is passed', () => {
			const predNotNull = createPredicate(number().nullable().notNullable());

			expect(predNotNull(null)).toBe(false);
			expect(predNotNull(123)).toBe(true);
		});
	});

	describe('optional', () => {
		it('returns true if the schema is optional and undefined is passed', () => {
			const predOpt = createPredicate(number().optional());

			expect(predOpt(undefined)).toBe(true);
			expect(predOpt(123)).toBe(true);
		});

		it('returns false if the schema is not optional and undefined is passed', () => {
			const predNotOpt = createPredicate(number().optional().required());

			expect(predNotOpt(undefined)).toBe(false);
			expect(predNotOpt(123)).toBe(true);
		});
	});
});
