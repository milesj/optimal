import { createSchema } from '../createSchema';
import { commonCriteria } from '../criteria';
import { invalid } from '../helpers';
import { CommonCriterias, DefaultValue, Schema, UnknownFunction } from '../types';

export interface FunctionSchema<T = UnknownFunction>
	extends Schema<T>,
		CommonCriterias<FunctionSchema<T>> {
	never: () => FunctionSchema<never>;
	notNullable: () => FunctionSchema<NonNullable<T>>;
	nullable: () => FunctionSchema<T | null>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function func<T extends (...args: any[]) => any = UnknownFunction>(
	defaultValue?: DefaultValue<T>,
) {
	return createSchema<FunctionSchema<T>>(
		{
			api: { ...commonCriteria },
			defaultValue,
			type: 'function',
		},
		[
			{
				skipIfNull: true,
				skipIfOptional: true,
				validate(value, path) {
					invalid(typeof value === 'function', 'Must be a function.', path, value);
				},
			},
		],
	);
}
