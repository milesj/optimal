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
	notUndefinable: () => FunctionSchema<NotUndefined<T>>;
	nullable: () => FunctionSchema<T | null>;
	undefinable: () => FunctionSchema<T | undefined>;
}

export function func<T extends AnyFunction = AnyFunction>(defaultValue?: DefaultValue<T>) {
	return createSchema<FunctionSchema<T>>(
		{
			api: { ...commonCriteria },
			defaultValue,
			type: 'function',
		},
		[
			{
				validate(value, path) {
					invalid(typeof value === 'function', 'Must be a function.', path, value);
				},
			},
		],
	).undefinable();
}
