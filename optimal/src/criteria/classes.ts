import { instanceOf, invalid, invariant, isObject } from '../helpers';
import { Constructor, Criteria, SchemaState } from '../types';

/**
 * Require this field to be an instance of the defined class.
 */
export function of<T>(
	state: SchemaState<T>,
	ref: Constructor<T>,
	loose: boolean = false,
): Criteria<T> {
	invariant(typeof ref === 'function', 'A class reference is required.');

	state.type = ref.name ?? ref.constructor.name;

	return {
		validate(value, path) {
			invalid(
				typeof ref === 'function' &&
					(value instanceof ref || (loose && isObject(value) && instanceOf(value, ref))),
				`Must be an instance of \`${state.type}\`.`,
				path,
				value,
			);
		},
	};
}
