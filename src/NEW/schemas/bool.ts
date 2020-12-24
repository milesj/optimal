import { commonCriteria, booleanCriteria } from '../criteria';
import createSchema from '../createSchema';
import { invariant } from '../helpers';
import { BooleanCriterias, CommonCriterias, Schema } from '../types';

export interface BoolSchema<T = boolean>
  extends Schema<T>,
    BooleanCriterias<BoolSchema<T>>,
    CommonCriterias<BoolSchema<T>> {
  notNullable: () => BoolSchema<NonNullable<T>>;
  nullable: () => BoolSchema<T | null>;
}

function validateType(value: unknown, path: string) {
  invariant(typeof value === 'boolean', 'Must be a boolean.', path);
}

export function bool(defaultValue: boolean = false): BoolSchema {
  return createSchema({
    cast: Boolean,
    criteria: { ...commonCriteria, ...booleanCriteria },
    defaultValue,
    type: 'boolean',
    validateType,
  });
}
