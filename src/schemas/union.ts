import { createSchema } from '../createSchema';
import { commonCriteria, unionCriteria } from '../criteria';
import { InferUnionItems } from '../criteria/unions';
import { CommonCriterias, InferNullable, Schema } from '../types';

export interface UnionSchema<T> extends Schema<T>, CommonCriterias<UnionSchema<T>> {
  never: () => UnionSchema<never>;
  notNullable: () => UnionSchema<NonNullable<T>>;
  nullable: () => UnionSchema<T | null>;
  of: <I = unknown>(schemas: InferUnionItems<I>[]) => UnionSchema<InferNullable<T, I>>;
}

export function union<T = unknown>(schemas: InferUnionItems<T>[], defaultValue: T): UnionSchema<T> {
  return createSchema<UnionSchema<T>>({
    criteria: { ...commonCriteria, ...unionCriteria },
    defaultValue,
    type: 'union',
    validateType() {
      // What to do here?
    },
  }).of(schemas) as UnionSchema<T>;
}
