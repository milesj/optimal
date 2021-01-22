import { createSchema } from '../createSchema';
import { commonCriteria, unionCriteria } from '../criteria';
import { CommonCriterias, InferNullable, Schema } from '../types';

export interface UnionSchema<T> extends Schema<T>, CommonCriterias<UnionSchema<T>> {
  never: () => UnionSchema<never>;
  notNullable: () => UnionSchema<NonNullable<T>>;
  nullable: () => UnionSchema<T | null>;
  of: <I = unknown>(schemas: Schema<unknown>[]) => UnionSchema<InferNullable<T, I>>;
}

export function union<T = unknown>(schemas: Schema<unknown>[], defaultValue: T): UnionSchema<T> {
  return createSchema({
    criteria: { ...commonCriteria, ...unionCriteria },
    defaultValue,
    type: 'union',
    validateType() {},
  }).of(schemas);
}
