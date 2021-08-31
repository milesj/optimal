import { createSchema } from '../createSchema';
import { commonCriteria, shapeCriteria } from '../criteria';
import { createObject, invalid, isObject } from '../helpers';
import { AnySchema } from '../types';
import { func } from './func';
import { ShapeSchema } from './shape';

// This is similar to shape, but we want to control the validation
export function schema<T extends AnySchema>(): ShapeSchema<T> {
	const shape = createSchema<ShapeSchema<T>>(
		{
			api: { ...commonCriteria, ...shapeCriteria },
			cast: createObject,
			type: 'shape',
		},
		[
			{
				skipIfNull: true,
				validate(value, path) {
					invalid(isObject(value), 'Must be a schema.', path, value);
				},
			},
		],
	);

	return shape.of({
		schema: func<T['schema']>().notNullable().required(),
		type: func<T['type']>().notNullable().required(),
		validate: func<T['validate']>().notNullable().required(),
	}) as unknown as ShapeSchema<T>;
}
