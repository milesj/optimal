import { Infer, number, NumberSchema } from '../../src';
import { runCommonTests } from './runCommonTests';

describe('number()', () => {
	let schema: NumberSchema<number>;

	beforeEach(() => {
		schema = number();
	});

	const litNumber = number().oneOf([1, 2, 3]);

	type AnyNumber = Infer<typeof schema>;
	type LiteralNumber = Infer<typeof litNumber>;

	runCommonTests((defaultValue) => number(defaultValue), 123, { defaultValue: 0 });

	describe('oneOf()', () => {
		let oneOfSchema: NumberSchema<1 | 2 | 3>;

		beforeEach(() => {
			oneOfSchema = schema.oneOf([1, 2, 3]);
		});

		it('errors if a non-number is passed', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				oneOfSchema.oneOf(['a']);
			}).toThrow('One of requires an array of numbers.');
		});

		it('errors if number is not in list', () => {
			expect(() => {
				oneOfSchema.validate(5);
			}).toThrow('Number must be one of: 1, 2, 3. Received 5.');
		});

		it('doesnt error if number is in list', () => {
			expect(() => {
				oneOfSchema.validate(1);
			}).not.toThrow();
		});
	});

	describe('between()', () => {
		let betweenSchema: NumberSchema;

		it('errors if a non-number is passed', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				schema.between('a');
			}).toThrow('Between requires a minimum and maximum number.');
		});

		describe('non-inclusive', () => {
			beforeEach(() => {
				betweenSchema = schema.between(1, 5);
			});

			it('errors if number is out of range', () => {
				expect(() => {
					betweenSchema.validate(10);
				}).toThrow('Number must be between 1 and 5, received 10.');
			});

			it('errors if number is edge of range', () => {
				expect(() => {
					betweenSchema.validate(5);
				}).toThrow('Number must be between 1 and 5, received 5.');
			});

			it('doesnt error if number is in range', () => {
				expect(() => {
					betweenSchema.validate(3);
				}).not.toThrow();
			});
		});

		describe('inclusive', () => {
			beforeEach(() => {
				betweenSchema = schema.between(1, 5, { inclusive: true });
			});

			it('errors if number is out of range', () => {
				expect(() => {
					betweenSchema.validate(10);
				}).toThrow('Number must be between 1 and 5 inclusive, received 10.');
			});

			it('doesnt error if number is edge of range', () => {
				expect(() => {
					betweenSchema.validate(5);
				}).not.toThrow();
			});

			it('doesnt error if number is in range', () => {
				expect(() => {
					betweenSchema.validate(3);
				}).not.toThrow();
			});
		});
	});

	describe('float()', () => {
		let floatSchema: NumberSchema;

		beforeEach(() => {
			floatSchema = schema.float();
		});

		it('errors if number is a non-float', () => {
			expect(() => {
				floatSchema.validate(1);
			}).toThrow('Number must be a float, received 1.');
		});

		it('doesnt error if number is a float', () => {
			expect(() => {
				floatSchema.validate(1.2);
			}).not.toThrow();
		});
	});

	describe('gt()', () => {
		let gtSchema: NumberSchema;

		beforeEach(() => {
			gtSchema = schema.gt(10);
		});

		it('errors if a non-number is passed', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				schema.gt('a');
			}).toThrow('Greater-than requires a minimum number.');
		});

		it('errors if number is too low', () => {
			expect(() => {
				gtSchema.validate(5);
			}).toThrow('Number must be greater than 10, received 5.');
		});

		it('errors if number is equal', () => {
			expect(() => {
				gtSchema.validate(10);
			}).toThrow('Number must be greater than 10, received 10.');
		});

		it('doesnt error if number is high enough', () => {
			expect(() => {
				gtSchema.validate(15);
			}).not.toThrow();
		});
	});

	describe('gte()', () => {
		let gteSchema: NumberSchema;

		beforeEach(() => {
			gteSchema = schema.gte(10);
		});

		it('errors if number is too low', () => {
			expect(() => {
				gteSchema.validate(5);
			}).toThrow('Number must be greater than or equal to 10, received 5.');
		});

		it('doesnt error if number is equal', () => {
			expect(() => {
				gteSchema.validate(10);
			}).not.toThrow();
		});

		it('doesnt error if number is high enough', () => {
			expect(() => {
				gteSchema.validate(15);
			}).not.toThrow();
		});
	});

	describe('int()', () => {
		let intSchema: NumberSchema;

		beforeEach(() => {
			intSchema = schema.int();
		});

		it('errors if number is a non-integer', () => {
			expect(() => {
				intSchema.validate(1.2);
			}).toThrow('Number must be an integer, received 1.2.');
		});

		it('doesnt error if number is an integer', () => {
			expect(() => {
				intSchema.validate(1);
			}).not.toThrow();
		});
	});

	describe('lt()', () => {
		let ltSchema: NumberSchema;

		beforeEach(() => {
			ltSchema = schema.lt(10);
		});

		it('errors if a non-number is passed', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				schema.lt('a');
			}).toThrow('Less-than requires a maximum number.');
		});

		it('errors if number is too high', () => {
			expect(() => {
				ltSchema.validate(15);
			}).toThrow('Number must be less than 10, received 15.');
		});

		it('errors if number is equal', () => {
			expect(() => {
				ltSchema.validate(10);
			}).toThrow('Number must be less than 10, received 10.');
		});

		it('doesnt error if number is high enough', () => {
			expect(() => {
				ltSchema.validate(5);
			}).not.toThrow();
		});
	});

	describe('lte()', () => {
		let lteSchema: NumberSchema;

		beforeEach(() => {
			lteSchema = schema.lte(10);
		});

		it('errors if number is too high', () => {
			expect(() => {
				lteSchema.validate(15);
			}).toThrow('Number must be less than or equal to 10, received 15.');
		});

		it('doesnt error if number is equal', () => {
			expect(() => {
				lteSchema.validate(10);
			}).not.toThrow();
		});

		it('doesnt error if number is high enough', () => {
			expect(() => {
				lteSchema.validate(5);
			}).not.toThrow();
		});
	});

	describe('negative()', () => {
		let negaSchema: NumberSchema;

		beforeEach(() => {
			negaSchema = schema.negative();
		});

		it('errors if number is positive', () => {
			expect(() => {
				negaSchema.validate(10);
			}).toThrow('Number must be negative, received 10.');
		});

		it('errors if number is 0', () => {
			expect(() => {
				negaSchema.validate(0);
			}).toThrow('Number must be negative, received 0.');
		});

		it('doesnt error if number is negative', () => {
			expect(() => {
				negaSchema.validate(-10);
			}).not.toThrow();
		});
	});

	describe('positive()', () => {
		let posiSchema: NumberSchema;

		beforeEach(() => {
			posiSchema = schema.positive();
		});

		it('errors if number is negative', () => {
			expect(() => {
				posiSchema.validate(-10);
			}).toThrow('Number must be positive, received -10.');
		});

		it('errors if number is 0', () => {
			expect(() => {
				posiSchema.validate(0);
			}).toThrow('Number must be positive, received 0.');
		});

		it('doesnt error if number is positive', () => {
			expect(() => {
				posiSchema.validate(10);
			}).not.toThrow();
		});
	});

	describe('type()', () => {
		it('returns "number"', () => {
			expect(number().type()).toBe('number');
		});
	});

	describe('validateType()', () => {
		it('errors if a non-number is passed', () => {
			expect(() => {
				schema.validate('abc');
			}).toThrow('Must be a number, received string.');
		});

		it('doesnt error if a number is passed', () => {
			expect(() => {
				schema.validate(456);
			}).not.toThrow();
		});

		it('errors if null is passed', () => {
			expect(() => {
				schema.validate(null);
			}).toThrow('Null is not allowed.');
		});
	});
});
