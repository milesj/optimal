import { createSchema } from '../createSchema';
import { commonCriteria } from '../criteria';
import { CommonCriterias, CustomCallback, Schema } from '../types';

export interface CustomSchema<T> extends Schema<T>, CommonCriterias<CustomSchema<T>> {
	never: () => CustomSchema<never>;
	notNullable: () => CustomSchema<NonNullable<T>>;
	nullable: () => CustomSchema<T | null>;
}

export function custom<T>(callback: CustomCallback<T>, defaultValue?: T) {
	return createSchema<CustomSchema<T>>({
		criteria: { ...commonCriteria },
		defaultValue,
		type: 'custom',
	}).custom(callback);
}
