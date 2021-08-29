import { createSchema } from '../createSchema';
import { commonCriteria, shapeCriteria } from '../criteria';
import { createObject, invariant, isObject } from '../helpers';
import { AnySchema, Criteria } from '../types';
import { func } from './func';
import { ShapeSchema } from './shape';

function validateType(): Criteria<unknown> | void {
	return {
		skipIfNull: true,
		validate(value, path) {
			invariant(isObject(value), 'Must be a schema.', path);
		},
	};
}

// This is similar to shape, but we want to control the validation
export function schema<T extends AnySchema>(): ShapeSchema<T> {
	const shape = createSchema<ShapeSchema<T>>({
		cast: createObject,
		criteria: { ...commonCriteria, ...shapeCriteria },
		type: 'shape',
		validateType,
	});

	return shape.of({
		schema: func<T['schema']>().notNullable().required(),
		type: func<T['type']>().notNullable().required(),
		validate: func<T['validate']>().notNullable().required(),
	}) as unknown as ShapeSchema<T>;
}
