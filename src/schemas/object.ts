import { createSchema } from '../createSchema';
import { commonCriteria, objectCriteria } from '../criteria';
import { createObject, invariant, isObject } from '../helpers';
import { CommonCriterias, Criteria, InferNullable, ObjectCriterias, Schema } from '../types';

export interface ObjectSchema<T = object>
  extends Schema<T>,
    ObjectCriterias<ObjectSchema<T>>,
    CommonCriterias<ObjectSchema<T>> {
  never: () => ObjectSchema<never>;
  notNullable: () => ObjectSchema<NonNullable<T>>;
  nullable: () => ObjectSchema<T | null>;
  of: <V, K extends string = string>(
    schema: Schema<V>,
  ) => ObjectSchema<InferNullable<T, Record<K, V>>>;
}

function validateType(): Criteria<Record<string, unknown>> | void {
  return {
    skipIfNull: true,
    validate(value, path) {
      invariant(isObject(value), 'Must be a plain object.', path);
    },
  };
}

export function object<V = unknown, K extends string = string>(
  defaultValue?: Record<K, V>,
): ObjectSchema<Record<K, V>> {
  return createSchema({
    cast: createObject,
    criteria: { ...commonCriteria, ...objectCriteria },
    defaultValue: defaultValue || {},
    type: 'object',
    validateType,
  });
}
