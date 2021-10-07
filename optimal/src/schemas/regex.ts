import { instance } from './instance';

/**
 * Create a schema that validates a value is a regex pattern (instance of `RegExp`).
 */
export function regex() /* infer */ {
	return instance().of(RegExp);
}
