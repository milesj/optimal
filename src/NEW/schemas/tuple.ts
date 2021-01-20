import { commonCriteria, tupleCriteria } from '../criteria';
import { InferTupleItems } from '../criteria/tuples';
import createSchema from '../createSchema';
import { createArray, invariant } from '../helpers';
import { CommonCriterias, Schema, InferNullable } from '../types';

export interface TupleSchema<T> extends Schema<T>, CommonCriterias<TupleSchema<T>> {
  never: () => TupleSchema<never>;
  notNullable: () => TupleSchema<NonNullable<T>>;
  nullable: () => TupleSchema<T | null>;
  of: <I extends unknown[]>(schemas: InferTupleItems<I>) => TupleSchema<InferNullable<T, I>>;
}

function validateType(value: unknown, path: string) {
  invariant(Array.isArray(value), 'Must be a tuple.', path);
}

export function tuple<T extends unknown[] = unknown[]>(
  schemas: InferTupleItems<T>,
  defaultValue?: T,
): TupleSchema<T> {
  return createSchema({
    cast: createArray,
    criteria: { ...commonCriteria, ...tupleCriteria },
    defaultValue,
    type: 'tuple',
    validateType,
  }).of(schemas);
}
