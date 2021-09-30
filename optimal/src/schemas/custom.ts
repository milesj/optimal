import { createSchema } from '../createSchema';
import { commonCriteria } from '../criteria';
import {
	CommonCriterias,
	CriteriaValidator,
	DefaultValue,
	NotNull,
	NotUndefined,
	Schema,
} from '../types';

export interface CustomSchema<T> extends Schema<T>, CommonCriterias<CustomSchema<T>> {
	never: () => CustomSchema<never>;
	notNullable: () => CustomSchema<NotNull<T>>;
	notUndefinable: () => CustomSchema<NotUndefined<T>>;
	nullable: () => CustomSchema<T | null>;
	undefinable: () => CustomSchema<T | undefined>;
}

export function custom<T>(validator: CriteriaValidator<T>, defaultValue: DefaultValue<T>) {
	return createSchema<CustomSchema<T>>({
		api: { ...commonCriteria },
		defaultValue,
		type: 'custom',
	}).custom(validator);
}
