import { createSchema } from '../createSchema';
import { commonCriteria } from '../criteria';
import { invalid, typeOf } from '../helpers';
import {
	AnyFunction,
	CommonCriterias,
	DefaultValueInitializer,
	NotNull,
	NotUndefined,
	Options,
	Schema,
} from '../types';

export interface FunctionSchema<T = AnyFunction>
	extends Schema<T>,
		CommonCriterias<FunctionSchema<T>> {
	/** Mark that this field should never be used. */
	never: (options?: Options) => FunctionSchema<never>;
	/** Disallow null values. */
	notNullable: (options?: Options) => FunctionSchema<NotNull<T>>;
	/** Disallow undefined values. Will fallback to the default value. */
	notUndefinable: () => FunctionSchema<NotUndefined<T>>;
	/** Allow and return null values. */
	nullable: () => FunctionSchema<T | null>;
	/** Allow and return undefined values. Will NOT fallback to the default value. */
	undefinable: () => FunctionSchema<T | undefined>;
}

// All schemas need a default value to operate correctly,
// but functions are a weird one. We want to verify that
// "this value is a function" without needing to return
// a default value (predicates, etc), but also sometimes
// return a default value when undefined is passed
// (option objects, etc). So by default (pun intended),
// this schema's default value is `undefined`.

/**
 * Create a schema that validates a value is a function.
 */
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
					// Special case, even when undefinable. See note above!
					if (value !== undefined) {
						invalid(
							typeof value === 'function',
							`Must be a function, received ${typeOf(value)}.`,
							path,
							value,
						);
					}

					return value;
				},
			},
		],
	);
}
