import { createSchema } from '../createSchema';
import { classCriteria, commonCriteria } from '../criteria';
import { invariant, isObject } from '../helpers';
import {
	CommonCriterias,
	Constructor,
	Criteria,
	InferNullable,
	Schema,
	SchemaState,
} from '../types';

export interface InstanceSchema<T> extends Schema<T>, CommonCriterias<InstanceSchema<T>> {
	never: () => InstanceSchema<never>;
	notNullable: () => InstanceSchema<NonNullable<T>>;
	nullable: () => InstanceSchema<T | null>;
	of: <C>(ref: Constructor<C>, loose?: boolean) => InstanceSchema<InferNullable<T, C>>;
}

function validateType<T>(state: SchemaState<T>): Criteria<T> | void {
	return {
		skipIfNull: true,
		validate(value, path) {
			invariant(
				isObject(value) && value.constructor !== Object,
				state.type === 'class'
					? 'Must be a class instance.'
					: `Must be an instance of ${state.type}.`,
				path,
			);
		},
	};
}

export function instance<T = Object>() {
	return createSchema<InstanceSchema<T | null>>({
		criteria: { ...commonCriteria, ...classCriteria },
		defaultValue: null,
		type: 'class',
		validateType,
	}).nullable();
}
