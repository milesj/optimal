import { createSchema } from '../createSchema';
import { commonCriteria, unionCriteria } from '../criteria';
import { AnySchema, CommonCriterias, DefaultValue, NotNull, Schema } from '../types';

export interface UnionSchema<T> extends Schema<T>, CommonCriterias<UnionSchema<T>> {
	never: () => UnionSchema<never>;
	notNullable: () => UnionSchema<NotNull<T>>;
	nullable: () => UnionSchema<T | null>;
	// Distribute these types in the future. Currently breaks on nulls...
	of: (schemas: AnySchema[]) => UnionSchema<T>;
}

export function union<T = unknown>(defaultValue: DefaultValue<T>): UnionSchema<T> {
	return createSchema<UnionSchema<T>>({
		api: { ...commonCriteria, ...unionCriteria },
		defaultValue,
		type: 'union',
	});
}
