import { createSchema } from '../createSchema';
import { commonCriteria } from '../criteria';
import { invalid } from '../helpers';
import {
	AnyFunction,
	CommonCriterias,
	DefaultValue,
	NotNull,
	NotUndefined,
	Schema,
} from '../types';

export interface FunctionSchema<T = AnyFunction>
	extends Schema<T>,
		CommonCriterias<FunctionSchema<T>> {
	never: () => FunctionSchema<never>;
	notNullable: () => FunctionSchema<NotNull<T>>;
	nullable: () => FunctionSchema<T | null>;
	optional: () => FunctionSchema<T | undefined>;
	required: () => FunctionSchema<NotUndefined<T>>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function func<T extends (...args: any[]) => any = AnyFunction>(
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
