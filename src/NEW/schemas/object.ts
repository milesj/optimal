import { commonCriteria, objectCriteria } from '../criteria';
import createSchema from '../createSchema';
import { invariant, isObject } from '../helpers';
import { CommonCriterias, Schema, ObjectCriterias, UnknownObject, InferNullable } from '../types';

export interface ObjectSchema<T = object>
  extends Schema<T>,
    ObjectCriterias<ObjectSchema<T>>,
    CommonCriterias<ObjectSchema<T>> {
  notNullable: () => ObjectSchema<NonNullable<T>>;
  nullable: () => ObjectSchema<T | null>;
  of: <V, K extends string = string>(
    schema: Schema<V>,
  ) => ObjectSchema<InferNullable<T, Record<K, V>>>;
}

function cast(value: unknown) {
  return (isObject(value) ? value : {}) as UnknownObject;
}

function validateType(value: unknown, path: string) {
  invariant(isObject(value), 'Must be a plain object.', path);
}

export function object<T = unknown, K extends string = string>(
  defaultValue?: Record<K, T>,
): ObjectSchema<Record<K, T>> {
  return createSchema({
    cast,
    criteria: { ...commonCriteria, ...objectCriteria },
    defaultValue: defaultValue || {},
    type: 'object',
    validateType,
  });
}
