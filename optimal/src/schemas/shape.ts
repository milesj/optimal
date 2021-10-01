import { createSchema } from '../createSchema';
import { commonCriteria, shapeCriteria } from '../criteria';
import { createObject, invalid, isObject, typeOf } from '../helpers';
import {
	Blueprint,
	CommonCriterias,
	NotNull,
	NotUndefined,
	Schema,
	ShapeCriterias,
} from '../types';

export interface ShapeSchema<T>
	extends Schema<Required<T>>,
		ShapeCriterias<ShapeSchema<T>>,
		CommonCriterias<ShapeSchema<T>> {
	never: () => ShapeSchema<never>;
	notNullable: () => ShapeSchema<NotNull<T>>;
	notUndefinable: () => ShapeSchema<NotUndefined<T>>;
	nullable: () => ShapeSchema<T | null>;
	/** @internal */
	of: <S extends object>(schema: Blueprint<S>) => ShapeSchema<S>;
	undefinable: () => ShapeSchema<T | undefined>;
}

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
