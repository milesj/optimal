import { CommonCriterias, Schema } from '../../src';
import { runInProd } from '../helpers';

interface TestCriterias<S> extends CommonCriterias<S> {
	never: () => S;
	notNullable: () => S;
	nullable: () => S;
}

// eslint-disable-next-line jest/no-export
export function runCommonTests<T>(
	factory: (initialValue?: T) => CommonCriterias<Schema<T | null>> & Schema<T | null>,
	value: T | null,
	{
		defaultValue,
		skipDefaultAsserts = false,
	}: {
		defaultValue: T | null | undefined;
		skipDefaultAsserts?: boolean;
	},
) {
	const nullableByDefault = defaultValue === null;
	let schema: Schema<T> & TestCriterias<Schema<T>>;

	// eslint-disable-next-line jest/require-top-level-describe
	beforeEach(() => {
		schema = factory(defaultValue!) as any;
	});

	describe('and()', () => {
		beforeEach(() => {
			schema.and('a', 'c');
		});

		it('errors if no keys are defined', () => {
			expect(() => {
				schema.and();
			}).toThrow('AND requires a list of field names.');
		});

		it('errors if not all properties are defined', () => {
			expect(() => {
				schema.validate(value, 'a', {
					a: 'a',
					b: 'b',
				});
			}).toThrow('All of these fields must be defined: a, c');
		});

		if (nullableByDefault) {
			it('errors if not all properties are defined and null is passed', () => {
				expect(() => {
					schema.validate(null, 'a', {
						a: 'a',
						b: 'b',
					});
				}).toThrow('All of these fields must be defined: a, c');
			});
		}

		it('doesnt error if all are defined', () => {
			expect(() => {
				schema.validate(value, 'a', {
					a: 'a',
					b: 'b',
					c: 'c',
				});
			}).not.toThrow();
		});

		if (nullableByDefault) {
			it('doesnt error if all are defined and null is passed', () => {
				expect(() => {
					schema.validate(null, 'a', {
						a: 'a',
						b: 'b',
						c: 'c',
					});
				}).not.toThrow();
			});
		} else {
			it('errors if all are defined and null is passed', () => {
				expect(() => {
					schema.validate(null, 'a', {
						a: 'a',
						b: 'b',
						c: 'c',
					});
				}).toThrow('Invalid field "a". Null is not allowed.');
			});
		}

		describe('production', () => {
			it(
				'doesnt error if no keys are defined',
				runInProd(() => {
					expect(() => {
						schema.and();
					}).not.toThrow();
				}),
			);

			it(
				'doesnt error if not all properties are defined',
				runInProd(() => {
					expect(() => {
						schema.validate(value, 'a', {
							a: 'a',
							b: 'b',
						});
					}).not.toThrow();
				}),
			);
		});
	});

	describe('custom()', () => {
		it('errors if no callback', () => {
			expect(() =>
				// @ts-expect-error Missing arg
				schema.custom(),
			).toThrow('Custom requires a validation function.');
		});

		it('errors if callback is not a function', () => {
			expect(() =>
				// @ts-expect-error Invalid type
				schema.custom(123),
			).toThrow('Custom requires a validation function.');
		});

		it('triggers callback function', () => {
			const spy = jest.fn();

			schema.custom(spy).validate(value, 'key', { key: null }, { root: true });

			expect(spy).toHaveBeenCalledWith(value, { key: null }, { root: true });
		});

		it('catches and re-throws errors', () => {
			expect(() =>
				schema
					.custom(() => {
						throw new Error('Oops');
					})
					.validate(value, 'key'),
			).toThrow('Oops');
		});

		describe('production', () => {
			it(
				'doesnt error if no callback',
				runInProd(() => {
					expect(() =>
						// @ts-expect-error Missing arg
						schema.custom(),
					).not.toThrow();
				}),
			);

			it(
				'doesnt error if callback is not a function',
				runInProd(() => {
					expect(() =>
						// @ts-expect-error Invalid type
						schema.custom(123),
					).not.toThrow();
				}),
			);

			it(
				'doesnt catch and re-throws errors',
				runInProd(() => {
					expect(() =>
						schema
							.custom(() => {
								throw new Error('Oops');
							})
							.validate(value, 'key'),
					).not.toThrow('Oops');
				}),
			);
		});
	});

	describe('deprecate()', () => {
		it('errors if no message', () => {
			expect(() =>
				// @ts-expect-error Missing arg
				schema.deprecate(),
			).toThrow('A non-empty string is required for deprecated messages.');
		});

		it('errors if empty message', () => {
			expect(() => schema.deprecate('')).toThrow(
				'A non-empty string is required for deprecated messages.',
			);
		});

		it('errors if invalid message type', () => {
			expect(() =>
				// @ts-expect-error Invalid type
				schema.deprecate(123),
			).toThrow('A non-empty string is required for deprecated messages.');
		});

		it('logs a message when validating', () => {
			const spy = jest.spyOn(console, 'info').mockImplementation();

			schema.deprecate('Migrate away!').validate(value, 'key', {});

			expect(spy).toHaveBeenCalledWith('Field "key" is deprecated. Migrate away!');

			spy.mockRestore();
		});

		describe('production', () => {
			it(
				'doesnt error if no message',
				runInProd(() => {
					expect(() =>
						// @ts-expect-error Missing arg
						schema.deprecate(),
					).not.toThrow();
				}),
			);

			it(
				'doesnt log a message when validating',
				runInProd(() => {
					const spy = jest.spyOn(console, 'info').mockImplementation();

					schema.deprecate('Migrate away!').validate(value, 'key', {});

					expect(spy).not.toHaveBeenCalled();

					spy.mockRestore();
				}),
			);
		});
	});

	describe('never()', () => {
		it('errors when validating', () => {
			expect(() => schema.never().validate(value)).toThrow('Field should never be used.');
		});

		describe('production', () => {
			it(
				'doesnt error when validating',
				runInProd(() => {
					expect(() => schema.never().validate(value)).not.toThrow();
					expect(schema.never().validate(value)).toEqual(value);
				}),
			);
		});
	});

	describe('nullable()', () => {
		beforeEach(() => {
			schema.nullable();
		});

		it('returns null when null is passed', () => {
			expect(schema.validate(null)).toBeNull();
		});

		if (!skipDefaultAsserts) {
			it('returns default value when undefined is passed', () => {
				expect(schema.validate(undefined)).toEqual(defaultValue);
			});
		}

		it('returns value when a valid value is passed', () => {
			expect(schema.validate(value)).toEqual(value);
		});

		it('doesnt error when null is passed', () => {
			expect(() => schema.validate(null)).not.toThrow();
		});

		it('doesnt error when undefined is passed', () => {
			expect(() => schema.validate(undefined)).not.toThrow();
		});

		it('doesnt error when a valid value is passed', () => {
			expect(() => schema.validate(value)).not.toThrow();
		});
	});

	describe('notNullable()', () => {
		beforeEach(() => {
			schema.notNullable();
		});

		it('returns value when a valid value is passed', () => {
			expect(schema.validate(value)).toEqual(value);
		});

		it('errors when null is passed', () => {
			expect(() => schema.validate(null)).toThrow('Null is not allowed.');
		});

		it('doesnt error when a valid value is passed', () => {
			expect(() => schema.validate(value)).not.toThrow();
		});

		if (defaultValue !== null) {
			if (!skipDefaultAsserts) {
				it('returns default value when undefined is passed', () => {
					expect(schema.validate(undefined)).toEqual(defaultValue);
				});
			}

			it('doesnt error when undefined is passed', () => {
				expect(() => schema.validate(undefined)).not.toThrow();
			});
		}

		describe('production', () => {
			it(
				'doesnt error when null is passed',
				runInProd(() => {
					expect(() => schema.validate(null)).not.toThrow();
					expect(schema.validate(null)).toBeNull(); // How to handle?
				}),
			);
		});
	});

	describe('required()', () => {
		beforeEach(() => {
			schema.required();
		});

		it('returns value when a valid value is passed', () => {
			expect(schema.validate(value)).toEqual(value);
		});

		it('errors when undefined is passed', () => {
			expect(() => schema.validate(undefined)).toThrow('Field is required and must be defined.');
		});

		it('doesnt error when a valid value is passed', () => {
			expect(() => schema.validate(value)).not.toThrow();
		});

		if (!skipDefaultAsserts) {
			describe('production', () => {
				it(
					'doesnt error when undefined is passed',
					runInProd(() => {
						expect(() => schema.validate(undefined)).not.toThrow();
						expect(schema.validate(undefined)).toEqual(defaultValue);
					}),
				);
			});
		}
	});

	describe('notRequired()', () => {
		beforeEach(() => {
			schema.notRequired();
		});

		if (!skipDefaultAsserts) {
			it('returns default value when undefind is passed', () => {
				expect(schema.validate(undefined)).toEqual(defaultValue);
			});
		}

		it('doesnt error when undefined is passed', () => {
			expect(() => schema.validate(undefined)).not.toThrow();
		});

		it('doesnt error when a valid value is passed', () => {
			expect(() => schema.validate(value)).not.toThrow();
		});
	});

	if (defaultValue !== null && defaultValue !== undefined && !skipDefaultAsserts) {
		describe('only()', () => {
			beforeEach(() => {
				schema.only();
			});

			it('doesnt error if value matches default value', () => {
				expect(() => {
					schema.validate(defaultValue);
				}).not.toThrow();
			});

			describe('production', () => {
				it(
					'doesnt error if default value is not the same type',
					runInProd(() => {
						expect(() => {
							factory(defaultValue).only();
						}).not.toThrow();
					}),
				);
			});
		});
	}

	describe('or()', () => {
		beforeEach(() => {
			schema.or('a', 'b');
		});

		it('errors if no keys are defined', () => {
			expect(() => {
				schema.or();
			}).toThrow('OR requires a list of field names.');
		});

		it('errors if not 1 option is defined', () => {
			expect(() => {
				schema.validate(value, 'a', {});
			}).toThrow('At least one of these fields must be defined: a, b');
		});

		it('doesnt error if at least 1 option is defined', () => {
			expect(() => {
				schema.validate(value, 'a', { a: 'a' });
			}).not.toThrow();
		});

		it('doesnt error if at least 1 option is defined that isnt the main field', () => {
			expect(() => {
				schema.validate(value, 'a', { b: 'b' });
			}).not.toThrow();
		});

		describe('production', () => {
			it(
				'errors if no keys are defined',
				runInProd(() => {
					expect(() => {
						schema.or();
					}).not.toThrow();
				}),
			);

			it(
				'errors if not 1 option is defined',
				runInProd(() => {
					expect(() => {
						schema.validate(value, 'a', {});
					}).not.toThrow();
				}),
			);
		});
	});

	describe('xor()', () => {
		beforeEach(() => {
			schema.xor('b', 'c');
		});

		it('errors if no keys are defined', () => {
			expect(() => {
				schema.xor();
			}).toThrow('XOR requires a list of field names.');
		});

		it('errors if no options are defined', () => {
			expect(() => {
				schema.validate(value, 'a', {});
			}).toThrow('Only one of these fields may be defined: a, b, c');
		});

		it('errors if more than 1 option is defined', () => {
			expect(() => {
				schema.validate(value, 'a', { a: 'a', b: 'b' });
			}).toThrow('Only one of these fields may be defined: a, b, c');
		});

		it('doesnt error if only 1 option is defined', () => {
			expect(() => {
				schema.validate(value, 'a', { a: 'a' });
			}).not.toThrow();
		});

		describe('production', () => {
			it(
				'doesnt error if no keys are defined',
				runInProd(() => {
					expect(() => {
						schema.xor();
					}).not.toThrow();
				}),
			);

			it(
				'doesnt error if no options are defined',
				runInProd(() => {
					expect(() => {
						schema.validate(value, 'a', {});
					}).not.toThrow();
				}),
			);

			it(
				'doesnt error if more than 1 option is defined',
				runInProd(() => {
					expect(() => {
						schema.validate(value, 'a', { a: 'a', b: 'b' });
					}).not.toThrow();
				}),
			);
		});
	});

	describe('validate()', () => {});
}
