import { createSchema } from '../createSchema';
import { commonCriteria, tupleCriteria } from '../criteria';
import { InferTupleItems } from '../criteria/tuples';
import { createArray, invariant } from '../helpers';
import { CommonCriterias, Criteria, InferNullable, Schema } from '../types';

export interface TupleSchema<T> extends Schema<T>, CommonCriterias<TupleSchema<T>> {
  never: () => TupleSchema<never>;
  notNullable: () => TupleSchema<NonNullable<T>>;
  nullable: () => TupleSchema<T | null>;
  /** @internal */
  of: <I extends unknown[]>(schemas: InferTupleItems<I>) => TupleSchema<InferNullable<T, I>>;
}

function validateType(): Criteria<unknown[]> | void {
  return {
    skipIfNull: true,
    validate(value, path) {
      invariant(Array.isArray(value), 'Must be a tuple.', path);
    },
  };
}

export function tuple<T extends unknown[] = unknown[]>(
  schemas: InferTupleItems<T>,
  defaultValue?: T,
): TupleSchema<T> {
  return createSchema<TupleSchema<T>>({
    // @ts-expect-error Ignore this, it's safe
    cast: createArray,
    criteria: { ...commonCriteria, ...tupleCriteria },
    defaultValue,
    type: 'tuple',
    validateType,
  }).of(schemas);
}
