import { createSchema } from '../createSchema';
import { commonCriteria } from '../criteria';
import { invariant } from '../helpers';
import { CommonCriterias, Criteria, Schema, UnknownFunction } from '../types';

export interface FunctionSchema<T = UnknownFunction>
	extends Schema<T>,
		CommonCriterias<FunctionSchema<T>> {
	never: () => FunctionSchema<never>;
	notNullable: () => FunctionSchema<NonNullable<T>>;
	nullable: () => FunctionSchema<T | null>;
}

function validateType<T>(): Criteria<T> | void {
	return {
		skipIfNull: true,
		skipIfOptional: true,
		validate(value, path) {
			invariant(typeof value === 'function', 'Must be a function.', path);
		},
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function func<T extends (...args: any[]) => any = UnknownFunction>(defaultValue?: T) {
	return createSchema<FunctionSchema<T>>({
		criteria: { ...commonCriteria },
		defaultValue,
		type: 'function',
		validateType,
	});
}
