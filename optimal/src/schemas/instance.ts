import { createSchema } from '../createSchema';
import { classCriteria, commonCriteria } from '../criteria';
import { invalid, isObject, prettyValue, typeOf } from '../helpers';
import {
	CommonCriterias,
	Constructor,
	InferNullable,
	InstanceOfOptions,
	NotNull,
	NotUndefined,
	Options,
	Schema,
} from '../types';

export interface InstanceSchema<T> extends Schema<T>, CommonCriterias<InstanceSchema<T>> {
	never: (options?: Options) => InstanceSchema<never>;
	notNullable: (options?: Options) => InstanceSchema<NotNull<T>>;
	notUndefinable: () => InstanceSchema<NotUndefined<T>>;
	nullable: () => InstanceSchema<T | null>;
	of: <C>(ref: Constructor<C>, options?: InstanceOfOptions) => InstanceSchema<InferNullable<T, C>>;
	undefinable: () => InstanceSchema<T | undefined>;
}

export function instance() {
	return createSchema<InstanceSchema<Object | null>>(
		{
			api: { ...commonCriteria, ...classCriteria },
			defaultValue: null,
			type: 'class',
		},
		[
			(state) => ({
				validate(value, path) {
					let valueType = typeOf(value);

					if (valueType === 'class') {
						valueType = prettyValue(value)!;
					}

					invalid(
						isObject(value) && value.constructor !== Object,
						state.type === 'class'
							? `Must be a class instance, received ${valueType}.`
							: `Must be an instance of \`${state.type}\`, received ${valueType}.`,
						path,
						value,
					);
				},
			}),
		],
	).nullable();
}
