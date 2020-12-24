import { commonCriteria, arrayCriteria } from '../criteria';
import createSchema from '../createSchema';
import { invariant } from '../helpers';
import { CommonCriterias, Schema, ArrayCriterias, InferNullable } from '../types';

export interface ArraySchema<T>
  extends Schema<T>,
    ArrayCriterias<ArraySchema<T>>,
    CommonCriterias<ArraySchema<T>> {
  notNullable: () => ArraySchema<NonNullable<T>>;
  nullable: () => ArraySchema<T | null>;
  of: <V>(schema: Schema<V>) => ArraySchema<InferNullable<T, V[]>>;
}

function cast(value: unknown): unknown[] {
  if (value === undefined) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function validateType(value: unknown, path: string) {
  invariant(Array.isArray(value), 'Must be an array.', path);
}

export function array<T = unknown>(defaultValue: T[] = []): ArraySchema<T[]> {
  return createSchema({
    cast,
    criteria: { ...commonCriteria, ...arrayCriteria },
    defaultValue,
    type: 'array',
    validateType,
  });
}
