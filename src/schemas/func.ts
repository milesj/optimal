import { createSchema } from '../createSchema';
import { commonCriteria } from '../criteria';
import { invariant } from '../helpers';
import { CommonCriterias, Criteria, Schema, SchemaState, UnknownFunction } from '../types';

export interface FunctionSchema<T = UnknownFunction>
  extends Schema<T>,
    CommonCriterias<FunctionSchema<T>> {
  never: () => FunctionSchema<never>;
  notNullable: () => FunctionSchema<NonNullable<T>>;
  nullable: () => FunctionSchema<T | null>;
}

function validateType<T>(state: SchemaState<T>): void | Criteria<T> {
  return {
    skipIfNull: true,
    validate(value, path) {
      invariant(typeof value === 'function', 'Must be a function.', path);
    },
  };
}

export function func<T extends UnknownFunction = UnknownFunction>(defaultValue: T | null = null) {
  return createSchema<FunctionSchema<T | null>>({
    criteria: { ...commonCriteria },
    defaultValue,
    type: 'function',
    validateType,
  }).nullable();
}
