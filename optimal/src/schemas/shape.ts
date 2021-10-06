import { createSchema } from '../createSchema';
import { commonCriteria, shapeCriteria } from '../criteria';
import { createObject, invalid, isObject, typeOf } from '../helpers';
import {
	Blueprint,
	CommonCriterias,
	NotNull,
	NotUndefined,
	Options,
	Schema,
	ShapeCriterias,
} from '../types';

export interface ShapeSchema<T>
	extends Schema<Required<T>>,
		ShapeCriterias<ShapeSchema<T>>,
		CommonCriterias<ShapeSchema<T>> {
	/** Mark that this field should never be used. */
	never: (options?: Options) => ShapeSchema<never>;
	/** Disallow null values. */
	notNullable: (options?: Options) => ShapeSchema<NotNull<T>>;
	/** Disallow undefined values. Will fallback to the default value. */
	notUndefinable: () => ShapeSchema<NotUndefined<T>>;
	/** Allow and return null values. */
	nullable: () => ShapeSchema<T | null>;
	/** @internal */
	of: <S extends object>(schema: Blueprint<S>) => ShapeSchema<S>;
	/** Allow and return undefined values. Will NOT fallback to the default value. */
	undefinable: () => ShapeSchema<T | undefined>;
}

/**
 * Create a schema that validates a value is a shaped object (explicit keys).
 */
export function shape<T extends object>(blueprint: Blueprint<T>): ShapeSchema<T> {
	return createSchema<ShapeSchema<T>>(
		{
			api: { ...commonCriteria, ...shapeCriteria },
			cast: createObject,
			type: 'shape',
		},
		[
			{
				validate(value, path) {
					if (value === undefined) {
						// Will be built from its items
						return {};
					}

					invalid(
						isObject(value),
						`Must be a shaped object, received ${typeOf(value)}.`,
						path,
						value,
					);

					return value;
				},
			},
		],
	).of(blueprint);
}
