import { createSchema } from '../createSchema';
import { commonCriteria } from '../criteria';
import { invalid } from '../helpers';
import {
	AnyFunction,
	CommonCriterias,
	DefaultValueInitializer,
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

// All schemas need a default value to operate correctly,
// but functions are a weird one. We want to verify that
// "this value is a function" without needing to return
// a default value (predicates, etc), but also sometimes
// return a default value when undefined is passed
// (option objects, etc). So by default (pun intended),
// this schema's default value is `undefined`.

export function func<T extends AnyFunction = AnyFunction>(
	defaultValue?: DefaultValueInitializer<T>,
) {
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
	);
}
