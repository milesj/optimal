import { commonCriteria } from '../criteria';
import { createSchema } from '../createSchema';
import { CommonCriterias, CustomCallback, Schema } from '../types';

export interface CustomSchema<T> extends Schema<T>, CommonCriterias<CustomSchema<T>> {
  never: () => CustomSchema<never>;
  notNullable: () => CustomSchema<NonNullable<T>>;
  nullable: () => CustomSchema<T | null>;
}

export function custom<T>(callback: CustomCallback<T>, defaultValue?: T): CustomSchema<T> {
  return createSchema({
    criteria: { ...commonCriteria },
    defaultValue,
    type: 'custom',
    validateType() {},
  }).custom(callback);
}
