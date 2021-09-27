import { createSchema } from '../createSchema';
import { classCriteria, commonCriteria } from '../criteria';
import { invalid, isObject } from '../helpers';
import { CommonCriterias, Constructor, InferNullable, NotNull, Schema } from '../types';

export interface InstanceSchema<T> extends Schema<T>, CommonCriterias<InstanceSchema<T>> {
	never: () => InstanceSchema<never>;
	notNullable: () => InstanceSchema<NotNull<T>>;
	nullable: () => InstanceSchema<T | null>;
	of: <C>(ref: Constructor<C>, loose?: boolean) => InstanceSchema<InferNullable<T, C>>;
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
				skipIfNull: true,
				validate(value, path) {
					invalid(
						isObject(value) && value.constructor !== Object,
						state.type === 'class'
							? 'Must be a class instance.'
							: `Must be an instance of ${state.type}.`,
						path,
						value,
					);
				},
			}),
		],
	).nullable();
}
