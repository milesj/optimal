import { commonCriteria, classCriteria } from '../criteria';
import createSchema from '../createSchema';
import { invariant, isObject } from '../helpers';
import { CommonCriterias, Schema, Constructor, InferNullable } from '../types';

export interface InstanceSchema<T> extends Schema<T>, CommonCriterias<InstanceSchema<T>> {
  never: () => InstanceSchema<never>;
  notNullable: () => InstanceSchema<NonNullable<T>>;
  nullable: () => InstanceSchema<T | null>;
  of: <C>(ref: Constructor<C>, loose?: boolean) => InstanceSchema<InferNullable<T, C>>;
}

function validateType(value: unknown, path: string) {
  invariant(isObject(value) && value.constructor !== Object, 'Must be a class instance.', path);
}

export function instance<T = object>(): InstanceSchema<T | null> {
  return createSchema({
    criteria: { ...commonCriteria, ...classCriteria },
    defaultValue: null,
    type: 'class',
    validateType,
  }).nullable();
}
