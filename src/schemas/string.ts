import { createSchema } from '../createSchema';
import { commonCriteria, stringCriteria } from '../criteria';
import { invariant } from '../helpers';
import {
  CommonCriterias,
  Criteria,
  InferNullable,
  Options,
  Schema,
  StringCriterias,
} from '../types';

export interface StringSchema<T = string>
  extends Schema<T>,
    StringCriterias<StringSchema<T>>,
    CommonCriterias<StringSchema<T>> {
  never: () => StringSchema<never>;
  notNullable: () => StringSchema<NonNullable<T>>;
  nullable: () => StringSchema<T | null>;
  oneOf: <I extends string = string>(
    list: I[],
    options?: Options,
  ) => StringSchema<InferNullable<T, I>>;
}

function cast(value: unknown): string {
  return value === undefined ? '' : String(value);
}

function validateType(): Criteria<string> | void {
  return {
    skipIfNull: true,
    validate(value, path) {
      invariant(typeof value === 'string', 'Must be a string.', path);
    },
  };
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
