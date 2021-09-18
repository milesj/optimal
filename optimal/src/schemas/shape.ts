import { createSchema } from '../createSchema';
import { commonCriteria, shapeCriteria } from '../criteria';
import { createObject, invalid, isObject } from '../helpers';
import { Blueprint, CommonCriterias, Schema, ShapeCriterias } from '../types';

export interface ShapeSchema<T>
	extends Schema<Required<T>>,
		ShapeCriterias<ShapeSchema<T>>,
		CommonCriterias<ShapeSchema<T>> {
	never: () => ShapeSchema<never>;
	notNullable: () => ShapeSchema<NonNullable<T>>;
	nullable: () => ShapeSchema<T | null>;
	/** @internal */
	of: <S extends object>(schema: Blueprint<S>) => ShapeSchema<S>;
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
				skipIfNull: true,
				validate(value, path) {
					if (value === undefined) {
						// Will be built from its items
						return {};
					}

					invalid(isObject(value), 'Must be a shaped object.', path, value);

					return value;
				},
			},
		],
	).of(blueprint);
}
