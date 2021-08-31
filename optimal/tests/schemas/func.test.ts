import { func, FunctionSchema, Infer, UnknownFunction } from '../../src';
import { runCommonTests } from './runCommonTests';

describe('func()', () => {
	let schema: FunctionSchema<UnknownFunction>;
	const noop = () => {};

	beforeEach(() => {
		schema = func();
	});

	const nullFunc = func().nullable();
	const typedFunc = func<(a: number) => string>();

	type AnyFunc = Infer<typeof schema>;
	type NullFunc = Infer<typeof nullFunc>;
	type TypedFunc = Infer<typeof typedFunc>;

	runCommonTests(() => func(), noop, { defaultValue: undefined });

	describe('type()', () => {
		it('returns "function"', () => {
			expect(func().type()).toBe('function');
		});
	});

	describe('validateType()', () => {
		it('errors if a non-function is passed', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				schema.validate(123);
			}).toThrow('Must be a function.');
		});

		it('doesnt error if a function is passed', () => {
			expect(() => {
				schema.validate(noop);
			}).not.toThrow();
		});

		it('errors if null is passed', () => {
			expect(() => {
				schema.validate(null);
			}).toThrow('Null is not allowed.');
		});
	});
});
