import { bool, BooleanSchema } from '../../src';
import { runInProd } from '../helpers';
import { runCommonTests } from './runCommonTests';

describe('bool()', () => {
	let schema: BooleanSchema;

	beforeEach(() => {
		schema = bool();
	});

	runCommonTests((defaultValue) => bool(defaultValue), true, {
		defaultValue: false,
	});

	describe('onlyFalse()', () => {
		beforeEach(() => {
			schema.onlyFalse();
		});

		it('errors if value is `true`', () => {
			expect(() => {
				schema.validate(true);
			}).toThrow('May only be `false`.');
		});

		it('errors if value is `null`', () => {
			expect(() => {
				schema.validate(null);
			}).toThrow('Null is not allowed.');
		});

		it('passes if value is `false`', () => {
			expect(() => {
				schema.validate(false);
			}).not.toThrow();
		});

		it('passes if value is undefined', () => {
			expect(() => {
				schema.validate(undefined);
			}).not.toThrow();
		});

		describe('production', () => {
			it(
				'doesnt error if value is `true`',
				runInProd(() => {
					expect(() => {
						schema.validate(true);
					}).not.toThrow();
				}),
			);
		});
	});

	describe('onlyTrue()', () => {
		beforeEach(() => {
			schema.onlyTrue();
		});

		it('errors if value is `false`', () => {
			expect(() => {
				schema.validate(false);
			}).toThrow('May only be `true`.');
		});

		it('errors if value is `null`', () => {
			expect(() => {
				schema.validate(null);
			}).toThrow('Null is not allowed.');
		});

		it('passes if value is `true`', () => {
			expect(() => {
				schema.validate(true);
			}).not.toThrow();
		});

		it('passes if value is undefined', () => {
			expect(() => {
				schema.validate(undefined);
			}).not.toThrow();
		});

		describe('production', () => {
			it(
				'doesnt error if value is `false`',
				runInProd(() => {
					expect(() => {
						schema.validate(false);
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
