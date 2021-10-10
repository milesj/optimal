import { createSchema } from '../createSchema';
import { commonCriteria, shapeCriteria } from '../criteria';
import { createObject, invalid, isObject, typeOf } from '../helpers';
import { AnySchema } from '../types';
import { func } from './func';
import { ShapeSchema } from './shape';

/**
 * Create a schema that validates a value is a schema instance.
 */
export function schema<T extends AnySchema>(): ShapeSchema<T> {
	// This is similar to shape, but we want to control the validation
	const shape = createSchema<ShapeSchema<T>>(
		{
			api: { ...commonCriteria, ...shapeCriteria },
			cast: createObject,
			type: 'shape',
		},
		[
			{
				validate(value, path) {
					// Dont use `isSchema` and rely on the shape below
					invalid(isObject(value), `Must be a schema, received ${typeOf(value)}.`, path, value);
				},
			},
		],
	);

	return shape.of({
		schema: func<T['schema']>().notNullable().notUndefinable().required(),
		state: func<T['state']>().notNullable().notUndefinable().required(),
		type: func<T['type']>().notNullable().notUndefinable().required(),
		validate: func<T['validate']>().notNullable().notUndefinable().required(),
	}) as unknown as ShapeSchema<T>;
}
