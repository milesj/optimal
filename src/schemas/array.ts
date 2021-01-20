import { commonCriteria, arrayCriteria } from '../criteria';
import { createSchema } from '../createSchema';
import { createArray, invariant } from '../helpers';
import { CommonCriterias, Schema, ArrayCriterias, InferNullable } from '../types';

export interface ArraySchema<T = unknown[]>
  extends Schema<T>,
    ArrayCriterias<ArraySchema<T>>,
    CommonCriterias<ArraySchema<T>> {
  never: () => ArraySchema<never>;
  notNullable: () => ArraySchema<NonNullable<T>>;
  nullable: () => ArraySchema<T | null>;
  of: <V>(schema: Schema<V>) => ArraySchema<InferNullable<T, V[]>>;
}

function validateType(value: unknown, path: string) {
  invariant(Array.isArray(value), 'Must be an array.', path);
}

export function array<T = unknown>(defaultValue: T[] = []): ArraySchema<T[]> {
  return createSchema({
    cast: createArray,
    criteria: { ...commonCriteria, ...arrayCriteria },
    defaultValue,
    type: 'array',
    validateType,
  });
}
