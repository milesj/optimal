import { createSchema } from '../createSchema';
import { commonCriteria, unionCriteria } from '../criteria';
import {
	AnySchema,
	CommonCriterias,
	DefaultValue,
	NotNull,
	NotUndefined,
	Options,
	Schema,
} from '../types';

export interface UnionSchema<T> extends Schema<T>, CommonCriterias<UnionSchema<T>> {
	never: (options?: Options) => UnionSchema<never>;
	notNullable: (options?: Options) => UnionSchema<NotNull<T>>;
	notUndefinable: () => UnionSchema<NotUndefined<T>>;
	nullable: () => UnionSchema<T | null>;
	// Distribute these types in the future. Currently breaks on nulls...
	of: (schemas: AnySchema[], options?: Options) => UnionSchema<T>;
	undefinable: () => UnionSchema<T | undefined>;
}

export function union<T = unknown>(defaultValue: DefaultValue<T>): UnionSchema<T> {
	return createSchema<UnionSchema<T>>({
		api: { ...commonCriteria, ...unionCriteria },
		defaultValue,
		type: 'union',
	});
}
