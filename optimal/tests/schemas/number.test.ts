import { Infer, number, NumberSchema } from '../../src';
import { runInProd } from '../helpers';
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
		beforeEach(() => {
			schema.oneOf([1, 2, 3]);
		});

		it('errors if a non-number is passed', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				schema.oneOf(['a']);
			}).toThrow('One of requires an array of numbers.');
		});

		it('errors if number is not in list', () => {
			expect(() => {
				schema.validate(5);
			}).toThrow('Number must be one of: 1, 2, 3');
		});

		it('doesnt error if number is in list', () => {
			expect(() => {
				schema.validate(1);
			}).not.toThrow();
		});

		describe('production', () => {
			it(
				'doesnt error if number is not in list',
				runInProd(() => {
					expect(() => {
						schema.validate(5);
					}).not.toThrow();
				}),
			);
		});
	});

	describe('between()', () => {
		it('errors if a non-number is passed', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				schema.between('a');
			}).toThrow('Between requires a minimum and maximum number.');
		});

		describe('non-inclusive', () => {
			beforeEach(() => {
				schema.between(1, 5);
			});

			it('errors if number is out of range', () => {
				expect(() => {
					schema.validate(10);
				}).toThrow('Number must be between 1 and 5.');
			});

			it('errors if number is edge of range', () => {
				expect(() => {
					schema.validate(5);
				}).toThrow('Number must be between 1 and 5.');
			});

			it('doesnt error if number is in range', () => {
				expect(() => {
					schema.validate(3);
				}).not.toThrow();
			});

			describe('production', () => {
				it(
					'doesnt error if number is out of range',
					runInProd(() => {
						expect(() => {
							schema.validate(10);
						}).not.toThrow();
					}),
				);
			});
		});

		describe('inclusive', () => {
			beforeEach(() => {
				schema.between(1, 5, { inclusive: true });
			});

			it('errors if number is out of range', () => {
				expect(() => {
					schema.validate(10);
				}).toThrow('Number must be between 1 and 5 inclusive.');
			});

			it('doesnt error if number is edge of range', () => {
				expect(() => {
					schema.validate(5);
				}).not.toThrow();
			});

			it('doesnt error if number is in range', () => {
				expect(() => {
					schema.validate(3);
				}).not.toThrow();
			});

			describe('production', () => {
				it(
					'doesnt error if number is out of range',
					runInProd(() => {
						expect(() => {
							schema.validate(10);
						}).not.toThrow();
					}),
				);
			});
		});
	});

	describe('float()', () => {
		beforeEach(() => {
			schema.float();
		});

		it('errors if number is a non-float', () => {
			expect(() => {
				schema.validate(1);
			}).toThrow('Number must be a float.');
		});

		it('doesnt error if number is a float', () => {
			expect(() => {
				schema.validate(1.2);
			}).not.toThrow();
		});

		describe('production', () => {
			it(
				'doesnt error if number is a non-float',
				runInProd(() => {
					expect(() => {
						schema.validate(1);
					}).not.toThrow();
				}),
			);
		});
	});

	describe('gt()', () => {
		beforeEach(() => {
			schema.gt(10);
		});

		it('errors if a non-number is passed', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				schema.gt('a');
			}).toThrow('Greater-than requires a minimum number.');
		});

		it('errors if number is too low', () => {
			expect(() => {
				schema.validate(5);
			}).toThrow('Number must be greater than 10.');
		});

		it('errors if number is equal', () => {
			expect(() => {
				schema.validate(10);
			}).toThrow('Number must be greater than 10.');
		});

		it('doesnt error if number is high enough', () => {
			expect(() => {
				schema.validate(15);
			}).not.toThrow();
		});

		describe('production', () => {
			it(
				'doesnt error if number is too low',
				runInProd(() => {
					expect(() => {
						schema.validate(5);
					}).not.toThrow();
				}),
			);
		});
	});

	describe('gte()', () => {
		beforeEach(() => {
			schema.gte(10);
		});

		it('errors if number is too low', () => {
			expect(() => {
				schema.validate(5);
			}).toThrow('Number must be greater than or equal to 10.');
		});

		it('doesnt error if number is equal', () => {
			expect(() => {
				schema.validate(10);
			}).not.toThrow();
		});

		it('doesnt error if number is high enough', () => {
			expect(() => {
				schema.validate(15);
			}).not.toThrow();
		});

		describe('production', () => {
			it(
				'doesnt error if number is too low',
				runInProd(() => {
					expect(() => {
						schema.validate(5);
					}).not.toThrow();
				}),
			);
		});
	});

	describe('int()', () => {
		beforeEach(() => {
			schema.int();
		});

		it('errors if number is a non-integer', () => {
			expect(() => {
				schema.validate(1.2);
			}).toThrow('Number must be an integer.');
		});

		it('doesnt error if number is an integer', () => {
			expect(() => {
				schema.validate(1);
			}).not.toThrow();
		});

		describe('production', () => {
			it(
				'doesnt error if number is a non-integer',
				runInProd(() => {
					expect(() => {
						schema.validate(1.2);
					}).not.toThrow();
				}),
			);
		});
	});

	describe('lt()', () => {
		beforeEach(() => {
			schema.lt(10);
		});

		it('errors if a non-number is passed', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				schema.lt('a');
			}).toThrow('Less-than requires a maximum number.');
		});

		it('errors if number is too high', () => {
			expect(() => {
				schema.validate(15);
			}).toThrow('Number must be less than 10.');
		});

		it('errors if number is equal', () => {
			expect(() => {
				schema.validate(10);
			}).toThrow('Number must be less than 10.');
		});

		it('doesnt error if number is high enough', () => {
			expect(() => {
				schema.validate(5);
			}).not.toThrow();
		});

		describe('production', () => {
			it(
				'doesnt error if number is too high',
				runInProd(() => {
					expect(() => {
						schema.validate(15);
					}).not.toThrow();
				}),
			);
		});
	});

	describe('lte()', () => {
		beforeEach(() => {
			schema.lte(10);
		});

		it('errors if number is too high', () => {
			expect(() => {
				schema.validate(15);
			}).toThrow('Number must be less than or equal to 10.');
		});

		it('doesnt error if number is equal', () => {
			expect(() => {
				schema.validate(10);
			}).not.toThrow();
		});

		it('doesnt error if number is high enough', () => {
			expect(() => {
				schema.validate(5);
			}).not.toThrow();
		});

		describe('production', () => {
			it(
				'doesnt error if number is too high',
				runInProd(() => {
					expect(() => {
						schema.validate(15);
					}).not.toThrow();
				}),
			);
		});
	});

	describe('negative()', () => {
		beforeEach(() => {
			schema.negative();
		});

		it('errors if number is positive', () => {
			expect(() => {
				schema.validate(10);
			}).toThrow('Number must be negative.');
		});

		it('errors if number is 0', () => {
			expect(() => {
				schema.validate(0);
			}).toThrow('Number must be negative.');
		});

		it('doesnt error if number is negative', () => {
			expect(() => {
				schema.validate(-10);
			}).not.toThrow();
		});

		describe('production', () => {
			it(
				'doesnt error if number is positive',
				runInProd(() => {
					expect(() => {
						schema.validate(10);
					}).not.toThrow();
				}),
			);
		});
	});

	describe('positive()', () => {
		beforeEach(() => {
			schema.positive();
		});

		it('errors if number is negative', () => {
			expect(() => {
				schema.validate(-10);
			}).toThrow('Number must be positive.');
		});

		it('errors if number is 0', () => {
			expect(() => {
				schema.validate(0);
			}).toThrow('Number must be positive.');
		});

		it('doesnt error if number is positive', () => {
			expect(() => {
				schema.validate(10);
			}).not.toThrow();
		});

		describe('production', () => {
			it(
				'doesnt error if number is negative',
				runInProd(() => {
					expect(() => {
						schema.validate(-10);
					}).not.toThrow();
				}),
			);
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
				// @ts-expect-error Invalid type
				schema.validate('abc');
			}).toThrow('Must be a number.');
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

		describe('production', () => {
			it(
				'doesnt error if a non-number is passed',
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
