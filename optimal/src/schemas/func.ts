import { createSchema } from '../createSchema';
import { commonCriteria } from '../criteria';
import { invalid, validateType } from '../helpers';
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
	notUndefinable: () => FunctionSchema<NotUndefined<T>>;
	nullable: () => FunctionSchema<T | null>;
	undefinable: () => FunctionSchema<T | undefined>;
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
			validateType((value, path) => {
				invalid(typeof value === 'function', 'Must be a function.', path, value);
			}),
		],
	);
}
