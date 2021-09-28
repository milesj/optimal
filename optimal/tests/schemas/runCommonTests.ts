import { jest } from '@jest/globals';
import { AnySchema, CommonCriterias, DefaultValue, Schema } from '../../src';

interface TestCriterias<S> extends CommonCriterias<S> {
	never: () => S;
	notNullable: () => S;
	nullable: () => S;
}

// eslint-disable-next-line jest/no-export
export function runCommonTests<T>(
	factory: (initialValue?: DefaultValue<T>) => AnySchema,
	value: T | null,
	{
		defaultValue,
		skipDefaultAsserts = false,
	}: {
		defaultValue: T | null | undefined;
		skipDefaultAsserts?: boolean;
	},
) {
	const optionalByDefault = defaultValue === undefined;
	const nullableByDefault = defaultValue === null;
	const emptyByDefault = nullableByDefault || optionalByDefault;
	let schema: Schema<T> & TestCriterias<Schema<T>>;

	// eslint-disable-next-line jest/require-top-level-describe
	beforeEach(() => {
		schema = factory(defaultValue!) as any;
	});

	describe('immutability', () => {
		it('returns a different instance for each chained method', () => {
			const otherSchema = schema.nullable();
			const anotherSchema = schema.never();

			expect(schema).not.toBe(otherSchema);
			expect(anotherSchema).not.toBe(otherSchema);

			const againSchema = (otherSchema as typeof schema).required();

			expect(againSchema).not.toBe(otherSchema);
		});
	});

	describe('default value', () => {
		it('returns default value when undefined is passed', () => {
			expect(schema.validate(undefined)).toEqual(defaultValue);
		});

		it('can lazy load the default value through a callback function', () => {
			schema = factory(() => defaultValue!) as any;

			expect(schema.validate(undefined)).toEqual(defaultValue);
		});

		if (!emptyByDefault && !skipDefaultAsserts) {
			it('passes the current path and objects to the lazy callback function', () => {
				const spy = jest.fn().mockReturnValue(defaultValue);

				// @ts-expect-error Ignore type requirement
				schema = factory(spy) as any;
				schema.validate(undefined, 'key.deep', {
					currentObject: { foo: '' },
					rootObject: {
						key: {
							deep: {
								foo: '',
							},
						},
					},
				});

				expect(spy).toHaveBeenCalledWith(
					'key.deep',
					{ foo: '' },
					{
						key: {
							deep: {
								foo: '',
							},
						},
					},
				);
			});
		}
	});

	describe('and()', () => {
		let andSchema: Schema<T>;

		beforeEach(() => {
			andSchema = schema.and('a', 'c');
		});

		it('errors if no keys are defined', () => {
			expect(() => {
				schema.and();
			}).toThrow('AND requires a list of field names.');
		});

		it('errors if not all properties are defined', () => {
			expect(() => {
				andSchema.validate(value, 'a', {
					currentObject: {
						a: 'a',
						b: 'b',
					},
				});
			}).toThrow('All of these fields must be defined: a, c');
		});

		if (nullableByDefault) {
			it('errors if not all properties are defined and null is passed', () => {
				expect(() => {
					andSchema.validate(null, 'a', {
						currentObject: {
							a: 'a',
							b: 'b',
						},
					});
				}).toThrow('All of these fields must be defined: a, c');
			});
		}

		it('doesnt error if all are defined', () => {
			expect(() => {
				andSchema.validate(value, 'a', {
					currentObject: {
						a: 'a',
						b: 'b',
						c: 'c',
					},
				});
			}).not.toThrow();
		});

		if (nullableByDefault) {
			it('doesnt error if all are defined and null is passed', () => {
				expect(() => {
					andSchema.validate(null, 'a', {
						currentObject: {
							a: 'a',
							b: 'b',
							c: 'c',
						},
					});
				}).not.toThrow();
			});
		} else {
			it('errors if all are defined and null is passed', () => {
				expect(() => {
					andSchema.validate(null, 'a', {
						currentObject: {
							a: 'a',
							b: 'b',
							c: 'c',
						},
					});
				}).toThrow('Null is not allowed.');
			});
		}
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

			schema.custom(spy).validate(value, 'key', {
				currentObject: { key: null },
				rootObject: { root: true },
			});

			expect(spy).toHaveBeenCalledWith(value, 'key', {
				collectErrors: true,
				currentObject: { key: null },
				rootObject: { root: true },
			});
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
			const spy = jest.spyOn(console, 'info').mockImplementation(() => {});

			schema.deprecate('Migrate away!').validate(value, 'key', {});

			expect(spy).toHaveBeenCalledWith('Field "key" is deprecated. Migrate away!');

			spy.mockRestore();
		});
	});

	describe('never()', () => {
		it('errors when validating', () => {
			expect(() => schema.never().validate(value)).toThrow('Field should never be used.');
		});
	});

	describe('nullable()', () => {
		let nullSchema: Schema<T>;

		beforeEach(() => {
			nullSchema = schema.nullable();
		});

		it('returns null when null is passed', () => {
			expect(nullSchema.validate(null)).toBeNull();
		});

		if (!skipDefaultAsserts) {
			it('returns default value when undefined is passed', () => {
				expect(nullSchema.validate(undefined)).toEqual(defaultValue);
			});
		}

		it('returns value when a valid value is passed', () => {
			expect(nullSchema.validate(value)).toEqual(value);
		});

		it('doesnt error when null is passed', () => {
			expect(() => nullSchema.validate(null)).not.toThrow();
		});

		it('doesnt error when undefined is passed', () => {
			expect(() => nullSchema.validate(undefined)).not.toThrow();
		});

		it('doesnt error when a valid value is passed', () => {
			expect(() => nullSchema.validate(value)).not.toThrow();
		});
	});

	describe('notNullable()', () => {
		let notNullSchema: Schema<T>;

		beforeEach(() => {
			notNullSchema = (schema.nullable() as typeof schema).notNullable();
		});

		it('returns value when a valid value is passed', () => {
			expect(notNullSchema.validate(value)).toEqual(value);
		});

		it('errors when null is passed', () => {
			expect(() => notNullSchema.validate(null)).toThrow('Null is not allowed.');
		});

		it('doesnt error when a valid value is passed', () => {
			expect(() => notNullSchema.validate(value)).not.toThrow();
		});

		if (!nullableByDefault) {
			if (!skipDefaultAsserts) {
				it('returns default value when undefined is passed', () => {
					expect(notNullSchema.validate(undefined)).toEqual(defaultValue);
				});
			}

			it('doesnt error when undefined is passed', () => {
				expect(() => notNullSchema.validate(undefined)).not.toThrow();
			});
		}
	});

	if (!emptyByDefault && !skipDefaultAsserts) {
		describe('only()', () => {
			let onlySchema: Schema<T>;

			beforeEach(() => {
				onlySchema = schema.only();
			});

			it('doesnt error if value matches default value', () => {
				expect(() => {
					onlySchema.validate(defaultValue);
				}).not.toThrow();
			});
		});
	}

	describe('or()', () => {
		let orSchema: Schema<T>;

		beforeEach(() => {
			orSchema = schema.or('a', 'b');
		});

		it('errors if no keys are defined', () => {
			expect(() => {
				schema.or();
			}).toThrow('OR requires a list of field names.');
		});

		it('errors if not 1 option is defined', () => {
			expect(() => {
				orSchema.validate(value, 'a', {});
			}).toThrow('At least one of these fields must be defined: a, b');
		});

		it('doesnt error if at least 1 option is defined', () => {
			expect(() => {
				orSchema.validate(value, 'a', { currentObject: { a: 'a' } });
			}).not.toThrow();
		});

		it('doesnt error if at least 1 option is defined that isnt the main field', () => {
			expect(() => {
				orSchema.validate(value, 'a', { currentObject: { b: 'b' } });
			}).not.toThrow();
		});
	});

	describe('xor()', () => {
		let xorSchema: Schema<T>;

		beforeEach(() => {
			xorSchema = schema.xor('b', 'c');
		});

		it('errors if no keys are defined', () => {
			expect(() => {
				schema.xor();
			}).toThrow('XOR requires a list of field names.');
		});

		it('errors if no options are defined', () => {
			expect(() => {
				xorSchema.validate(value, 'a', {});
			}).toThrow('Only one of these fields may be defined: a, b, c');
		});

		it('errors if more than 1 option is defined', () => {
			expect(() => {
				xorSchema.validate(value, 'a', { currentObject: { a: 'a', b: 'b' } });
			}).toThrow('Only one of these fields may be defined: a, b, c');
		});

		it('doesnt error if only 1 option is defined', () => {
			expect(() => {
				xorSchema.validate(value, 'a', { currentObject: { a: 'a' } });
			}).not.toThrow();
		});
	});
}
