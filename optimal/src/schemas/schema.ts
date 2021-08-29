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
export function schema(): ShapeSchema<AnySchema> {
	return createSchema<ShapeSchema<AnySchema>>({
		cast: createObject,
		criteria: { ...commonCriteria, ...shapeCriteria },
		type: 'shape',
		validateType,
	}).of({
		schema: func<AnySchema['schema']>().notNullable().required(),
		type: func<AnySchema['type']>().notNullable().required(),
		validate: func<AnySchema['validate']>().notNullable().required(),
	});
}
