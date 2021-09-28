import { createSchema } from '../createSchema';
import { commonCriteria, unionCriteria } from '../criteria';
import { AnySchema, CommonCriterias, DefaultValue, NotNull, NotUndefined, Schema } from '../types';

export interface UnionSchema<T> extends Schema<T>, CommonCriterias<UnionSchema<T>> {
	never: () => UnionSchema<never>;
	notNullable: () => UnionSchema<NotNull<T>>;
	notUndefinable: () => UnionSchema<NotUndefined<T>>;
	nullable: () => UnionSchema<T | null>;
	// Distribute these types in the future. Currently breaks on nulls...
	of: (schemas: AnySchema[]) => UnionSchema<T>;
	undefinable: () => UnionSchema<T | undefined>;
}

export function union<T = unknown>(defaultValue: DefaultValue<T>): UnionSchema<T> {
	return createSchema<UnionSchema<T>>({
		api: { ...commonCriteria, ...unionCriteria },
		defaultValue,
		type: 'union',
	});
}
