import { instanceOf, invalid, invariant, isObject } from '../helpers';
import { Constructor, Criteria, InstanceOfOptions, SchemaState } from '../types';

/**
 * Require this field to be an instance of the defined class.
 * When `loose` is true, will compare using the class name.
 * This should only be used when dealing with realms and package hazards.
 */
export function of<T>(
	state: SchemaState<T>,
	ref: Constructor<T>,
	options: InstanceOfOptions = {},
): Criteria<T> {
	invariant(typeof ref === 'function', 'A class reference is required.');

	state.type = ref.name ?? ref.constructor.name;

	return {
		validate(value, path) {
			invalid(
				typeof ref === 'function' &&
					(value instanceof ref || (!!options.loose && isObject(value) && instanceOf(value, ref))),
				options.message ?? `Must be an instance of \`${state.type}\`.`,
				path,
				value,
			);
		},
	};
}
