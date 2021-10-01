import { AnyFunction, func, FunctionSchema, Infer } from '../../src';
import { runCommonTests } from './runCommonTests';

describe('func()', () => {
	let schema: FunctionSchema<AnyFunction>;
	function noop() {}

	beforeEach(() => {
		schema = func();
	});

	const nullFunc = func().nullable();
	const typedFunc = func<(a: number) => string>();

	type AnyFunc = Infer<typeof schema>;
	type NullFunc = Infer<typeof nullFunc>;
	type TypedFunc = Infer<typeof typedFunc>;

	runCommonTests(() => func(), noop, { defaultValue: undefined, skipDefaultAsserts: true });

	it('supports default values when not undefinable', () => {
		const spy = jest.fn();
		schema = func<AnyFunction>(() => spy);

		expect(schema.validate(undefined)).toBe(spy);
	});

	describe('type()', () => {
		it('returns "function"', () => {
			expect(func().type()).toBe('function');
		});
	});

	describe('validateType()', () => {
		it('errors if a non-function is passed', () => {
			expect(() => {
				schema.validate(123);
			}).toThrow('Must be a function, received number.');
		});

		it('doesnt error if a function is passed', () => {
			expect(() => {
				schema.validate(() => {});
			}).not.toThrow();
		});

		it('errors if null is passed', () => {
			expect(() => {
				schema.validate(null);
			}).toThrow('Null is not allowed.');
		});
	});
});
