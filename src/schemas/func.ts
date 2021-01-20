import { commonCriteria } from '../criteria';
import { createSchema } from '../createSchema';
import { CommonCriterias, Schema, UnknownFunction } from '../types';
import { invariant } from '../helpers';

export interface FunctionSchema<T = UnknownFunction>
  extends Schema<T>,
    CommonCriterias<FunctionSchema<T>> {
  never: () => FunctionSchema<never>;
  notNullable: () => FunctionSchema<NonNullable<T>>;
  nullable: () => FunctionSchema<T | null>;
}

function validateType(value: unknown, path: string) {
  invariant(typeof value === 'function', 'Must be a function.', path);
}

export function func<T extends UnknownFunction = UnknownFunction>(
  defaultValue: T | null = null,
): FunctionSchema<T | null> {
  return createSchema({
    criteria: { ...commonCriteria },
    defaultValue,
    type: 'function',
    validateType,
  }).nullable();
}
