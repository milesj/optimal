import { createSchema } from '../createSchema';
import { commonCriteria, shapeCriteria } from '../criteria';
import { createObject, invariant, isObject } from '../helpers';
import {
	Blueprint,
	CommonCriterias,
	Criteria,
	InferNullable,
	Schema,
	ShapeCriterias,
} from '../types';

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

function validateType(): Criteria<unknown> | void {
	return {
		skipIfNull: true,
		validate(value, path) {
			if (value === undefined) {
				return {};
			}

			invariant(isObject(value), 'Must be a shaped object.', path);

			return value;
		},
	};
}

export function shape<T extends object>(blueprint: Blueprint<T>, defaultValue?: T): ShapeSchema<T> {
	return createSchema<ShapeSchema<T>>({
		cast: createObject,
		criteria: { ...commonCriteria, ...shapeCriteria },
		defaultValue,
		type: 'shape',
		validateType,
	}).of(blueprint);
}
