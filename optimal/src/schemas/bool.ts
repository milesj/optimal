import { createSchema } from '../createSchema';
import { booleanCriteria, commonCriteria } from '../criteria';
import { invariant } from '../helpers';
import { BooleanCriterias, CommonCriterias, Criteria, Schema } from '../types';

export interface BooleanSchema<T = boolean>
	extends Schema<T>,
		BooleanCriterias<BooleanSchema<T>>,
		CommonCriterias<BooleanSchema<T>> {
	never: () => BooleanSchema<never>;
	notNullable: () => BooleanSchema<NonNullable<T>>;
	nullable: () => BooleanSchema<T | null>;
}

function validateType(): Criteria<boolean> | void {
	return {
		skipIfNull: true,
		validate(value, path) {
			invariant(typeof value === 'boolean', 'Must be a boolean.', path);
		},
	};
}

export function bool(defaultValue: boolean = false): BooleanSchema {
	return createSchema({
		cast: Boolean,
		criteria: { ...commonCriteria, ...booleanCriteria },
		defaultValue,
		type: 'boolean',
		validateType,
	});
}
