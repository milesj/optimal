import { commonCriteria, stringCriteria } from '../criteria';
import createSchema from '../createSchema';
import { CommonCriterias, StringCriterias, Schema, InferNullable } from '../types';
import { invariant } from '../helpers';

export interface StringSchema<T = string>
  extends Schema<T>,
    StringCriterias<StringSchema<T>>,
    CommonCriterias<StringSchema<T>> {
  never: () => StringSchema<never>;
  notNullable: () => StringSchema<NonNullable<T>>;
  nullable: () => StringSchema<T | null>;
  oneOf: <I extends string = string>(list: I[]) => StringSchema<InferNullable<T, I>>;
}

function cast(value: unknown): string {
  return value === undefined ? '' : String(value);
}

function validateType(value: unknown, path: string) {
  invariant(typeof value === 'string', 'Must be a string.', path);
}

export function string(defaultValue: string = ''): StringSchema<string> {
  return createSchema({
    cast,
    criteria: { ...commonCriteria, ...stringCriteria },
    defaultValue,
    type: 'string',
    validateType,
  });
}
