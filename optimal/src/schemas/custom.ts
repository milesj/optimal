import { createSchema } from '../createSchema';
import { commonCriteria } from '../criteria';
import { CommonCriterias, CustomCallback, DefaultValue, Schema } from '../types';

export interface CustomSchema<T> extends Schema<T>, CommonCriterias<CustomSchema<T>> {
	never: () => CustomSchema<never>;
	notNullable: () => CustomSchema<NonNullable<T>>;
	nullable: () => CustomSchema<T | null>;
}

export function custom<T>(callback: CustomCallback<T>, defaultValue?: DefaultValue<T>) {
	return createSchema<CustomSchema<T>>({
		criteria: { ...commonCriteria },
		defaultValue,
		type: 'custom',
	}).custom(callback);
}
