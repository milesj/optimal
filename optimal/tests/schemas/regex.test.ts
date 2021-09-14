import { Infer, InstanceSchema, regex } from '../../src';
import { runCommonTests } from './runCommonTests';

describe('regex()', () => {
	let schema: InstanceSchema<RegExp | null>;

	beforeEach(() => {
		schema = regex();
	});

	const notNullRegex = regex().notNullable();

	type AnyRegex = Infer<typeof schema>;
	type NotNullRegex = Infer<typeof notNullRegex>;

	runCommonTests(() => regex(), /abc/u, { defaultValue: null });

	describe('type()', () => {
		it('returns "RegExp"', () => {
			expect(regex().type()).toBe('RegExp');
		});
	});

	describe('validateType()', () => {
		it('errors if a non-object is passed', () => {
			expect(() => {
				schema.validate(123);
			}).toThrow('Must be an instance of RegExp.');
		});

		it('errors if a plain object is passed', () => {
			expect(() => {
				schema.validate({});
			}).toThrow('Must be an instance of RegExp.');
		});

		it('doesnt error if a regex pattern is passed', () => {
			expect(() => {
				schema.validate(/foo/u);
			}).not.toThrow();
		});

		it('doesnt error if null is passed', () => {
			expect(() => {
				schema.validate(null);
			}).not.toThrow();
		});
	});
});
