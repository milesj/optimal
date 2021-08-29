import { createSchema } from '../createSchema';
import { booleanCriteria, commonCriteria } from '../criteria';
import { invariant } from '../helpers';
import { CommonCriterias, Criteria, DefaultValue, Options, Schema } from '../types';

export interface BooleanSchema<T = boolean> extends Schema<T>, CommonCriterias<BooleanSchema<T>> {
	never: () => BooleanSchema<never>;
	notNullable: () => BooleanSchema<NonNullable<T>>;
	nullable: () => BooleanSchema<T | null>;
	onlyFalse: (options?: Options) => BooleanSchema<false>;
	onlyTrue: (options?: Options) => BooleanSchema<true>;
}

function validateType(): Criteria<boolean> | void {
	return {
		skipIfNull: true,
		validate(value, path) {
			invariant(typeof value === 'boolean', 'Must be a boolean.', path);
		},
	};
}

export function bool(defaultValue: DefaultValue<boolean> = false): BooleanSchema {
	return createSchema({
		cast: Boolean,
		criteria: { ...commonCriteria, ...booleanCriteria },
		defaultValue,
		type: 'boolean',
		validateType,
	});
}
