import { createSchema } from '../createSchema';
import { commonCriteria, shapeCriteria } from '../criteria';
import { createObject, invariant, isObject } from '../helpers';
import { Blueprint, CommonCriterias, InferNullable, Schema, ShapeCriterias } from '../types';

export interface ShapeSchema<T>
	extends Schema<T, Partial<T>>,
		ShapeCriterias<ShapeSchema<T>>,
		CommonCriterias<ShapeSchema<T>> {
	never: () => ShapeSchema<never>;
	notNullable: () => ShapeSchema<NonNullable<T>>;
	nullable: () => ShapeSchema<T | null>;
	/** @internal */
	of: <S extends object>(schema: Blueprint<S>) => ShapeSchema<InferNullable<T, S>>;
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

					invariant(isObject(value), 'Must be a shaped object.', path);

					return value;
				},
			},
		],
	).of(blueprint);
}
