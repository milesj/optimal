import { object } from './object';
import { schema } from './schema';

/**
 * Create a schema that validates a value is an indexed object of schemas.
 */
export function blueprint() /* infer */ {
	return object().of(schema().notNullable());
}
