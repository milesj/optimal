import { bool, BooleanSchema, Infer } from '../../src';
import { runInProd } from '../helpers';
import { runCommonTests } from './runCommonTests';

describe('bool()', () => {
	let schema: BooleanSchema;

	beforeEach(() => {
		schema = bool();
	});

	const anyBool = bool();
	const trueBool = bool().onlyTrue();
	const falseBool = bool().onlyFalse();

	type AnyBool = Infer<typeof anyBool>;
	type TrueBool = Infer<typeof trueBool>;
	type FalseBool = Infer<typeof falseBool>;

	runCommonTests((defaultValue) => bool(defaultValue), true, {
		defaultValue: false,
	});

	describe('onlyFalse()', () => {
		let falseSchema: BooleanSchema<false>;

		beforeEach(() => {
			falseSchema = schema.onlyFalse();
		});

		it('errors if value is `true`', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				falseSchema.validate(true);
			}).toThrow('May only be `false`.');
		});

		it('errors if value is `null`', () => {
			expect(() => {
				falseSchema.validate(null);
			}).toThrow('Null is not allowed.');
		});

		it('passes if value is `false`', () => {
			expect(() => {
				falseSchema.validate(false);
			}).not.toThrow();
		});

		it('passes if value is undefined', () => {
			expect(() => {
				falseSchema.validate(undefined);
			}).not.toThrow();
		});

		describe('production', () => {
			it(
				'doesnt error if value is `true`',
				runInProd(() => {
					expect(() => {
						// @ts-expect-error Invalid type
						falseSchema.validate(true);
					}).not.toThrow();
				}),
			);
		});
	});

	describe('onlyTrue()', () => {
		let trueSchema: BooleanSchema<true>;

		beforeEach(() => {
			trueSchema = schema.onlyTrue();
		});

		it('errors if value is `false`', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				trueSchema.validate(false);
			}).toThrow('May only be `true`.');
		});

		it('errors if value is `null`', () => {
			expect(() => {
				trueSchema.validate(null);
			}).toThrow('Null is not allowed.');
		});

		it('passes if value is `true`', () => {
			expect(() => {
				trueSchema.validate(true);
			}).not.toThrow();
		});

		it('passes if value is undefined', () => {
			expect(() => {
				trueSchema.validate(undefined);
			}).not.toThrow();
		});

		describe('production', () => {
			it(
				'doesnt error if value is `false`',
				runInProd(() => {
					expect(() => {
						// @ts-expect-error Invalid type
						trueSchema.validate(false);
					}).not.toThrow();
				}),
			);
		});
	});

	describe('type()', () => {
		it('returns "boolean"', () => {
			expect(bool().type()).toBe('boolean');
		});
	});

	describe('validateType()', () => {
		it('errors if a non-boolean is passed', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				schema.validate(123);
			}).toThrow('Must be a boolean.');
		});

		it('doesnt error if a boolean is passed', () => {
			expect(() => {
				schema.validate(true);
			}).not.toThrow();
		});

		it('errors if null is passed', () => {
			expect(() => {
				schema.validate(null);
			}).toThrow('Null is not allowed.');
		});

		describe('production', () => {
			it(
				'doesnt error if a non-boolean is passed',
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
