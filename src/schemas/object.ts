import { createSchema } from '../createSchema';
import { commonCriteria, objectCriteria } from '../criteria';
import { createObject, invariant, isObject } from '../helpers';
import { CommonCriterias, InferNullable, ObjectCriterias, Schema } from '../types';

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

function validateType(value: unknown, path: string) {
  invariant(isObject(value), 'Must be a plain object.', path);
}

export function object<T = unknown, K extends string = string>(
  defaultValue?: Record<K, T>,
): ObjectSchema<Record<K, T>> {
  return createSchema({
    cast: createObject,
    criteria: { ...commonCriteria, ...objectCriteria },
    defaultValue: defaultValue || {},
    type: 'object',
    validateType,
  });
}
