import { number, shape, string } from '../../src';

describe('common', () => {
	describe('required()', () => {
		const reqSchema = shape({
			foo: string().required(),
			bar: number(),
		});

		it('errors when not defined', () => {
			expect(() => reqSchema.validate({})).toThrow('Field is required and must be defined.');
		});

		it('errors when undefined is passed', () => {
			expect(() => reqSchema.validate({ foo: undefined })).toThrow(
				'Field is required and must be defined.',
			);
		});

		it('doesnt error when a valid value is passed', () => {
			expect(() => reqSchema.validate({ foo: 'abc', bar: 123 })).not.toThrow();
		});
	});

	describe('optional()', () => {
		const optSchema = shape({
			foo: string().required().optional(), // Test reseting
			bar: number(),
		});

		it('doesnt error when nothing is defined', () => {
			expect(() => optSchema.validate({})).not.toThrow();
		});

		it('doesnt error when undefined is passed', () => {
			expect(() => optSchema.validate({})).not.toThrow();
		});

		it('doesnt error when a valid value is passed', () => {
			expect(() => optSchema.validate({ foo: 'abc', bar: 123 })).not.toThrow();
		});
	});

	describe('undefinable()', () => {
		it('returns undefined instead of default value when undefined is passed', () => {
			expect(string().undefinable().validate(undefined)).toBeUndefined();
		});

		it('returns new value from criteria (when applicable) when undefined is passed', () => {
			expect(string().undefinable().validate(undefined)).toBeUndefined();
		});
	});

	describe('when()', () => {
		it('errors if a non-schema is passed to the pass path', () => {
			expect(() => {
				string().when(
					'abc',
					// @ts-expect-error Invalid type
					123,
				);
			}).toThrow('A schema is required when the condition passes.');
		});

		it('doesnt error if a schema is passed to the pass path', () => {
			expect(() => {
				string().when('abc', string());
			}).not.toThrow();
		});

		it('errors if a non-schema is passed to the fail path', () => {
			expect(() => {
				string().when(
					'abc',
					string(),
					// @ts-expect-error Invalid type
					123,
				);
			}).toThrow('A schema is required when the condition fails.');
		});

		it('doesnt error if a schema is passed to the fail path', () => {
			expect(() => {
				string().when('abc', string(), string());
			}).not.toThrow();
		});

		it('passes default value when undefined is passed', () => {
			expect(string('default').when('abc', string('when').nullable()).validate(undefined)).toBe(
				'default',
			);
		});

		it('skips pass condition if not a match', () => {
			expect(string('default').when('abc', string('when').notNullable()).validate('foo')).toBe(
				'foo',
			);
		});

		it('can chain multiple when calls', () => {
			const schema = string('default')
				.when('FOO', string().lowerCase())
				.when('bar', string().upperCase())
				.when('bAZ', string().pascalCase());

			expect(() => {
				schema.validate('FOO');
			}).toThrow('String must be lower cased.');

			expect(() => {
				schema.validate('bar');
			}).toThrow('String must be upper cased.');

			expect(() => {
				schema.validate('bAZ');
			}).toThrow('String must be in pascal case. (pattern "^[A-Z][a-zA-Z0-9]+$")');

			expect(schema.validate('qux')).toBe('qux');
		});

		it('can reference values in other fields', () => {
			const schema = string('default').when(
				(value, object) => object?.other === 'test',
				string().never(),
			);

			expect(() => {
				schema.validate('value', '', {
					currentObject: {
						other: 'other',
					},
				});
			}).not.toThrow();

			expect(() => {
				schema.validate('value', '', {
					currentObject: {
						other: 'test',
					},
				});
			}).toThrow('Field should never be used.');
		});

		describe('conditions', () => {
			const schema = string('default').when('fOo', string().lowerCase(), string().upperCase());

			it('triggers pass condition', () => {
				expect(() => {
					schema.validate('fOo');
				}).toThrow('String must be lower cased.');
			});

			it('triggers fail condition', () => {
				expect(() => {
					schema.validate('FoO');
				}).toThrow('String must be upper cased.');
			});
		});

		describe('conditions with callback', () => {
			const schema = string('default').when(
				(value) => value === 'fOo',
				string().lowerCase(),
				string().upperCase(),
			);

			it('triggers pass condition', () => {
				expect(() => {
					schema.validate('fOo');
				}).toThrow('String must be lower cased.');
			});

			it('triggers fail condition', () => {
				expect(() => {
					schema.validate('FoO');
				}).toThrow('String must be upper cased.');
			});
		});
	});
});
