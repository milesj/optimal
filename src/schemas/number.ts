import { createSchema } from '../createSchema';
import { commonCriteria, numberCriteria } from '../criteria';
import { invariant } from '../helpers';
import {
  CommonCriterias,
  Criteria,
  InferNullable,
  NumberCriterias,
  Options,
  Schema,
} from '../types';

export interface NumberSchema<T = number>
  extends Schema<T>,
    NumberCriterias<NumberSchema<T>>,
    CommonCriterias<NumberSchema<T>> {
  never: () => NumberSchema<never>;
  notNullable: () => NumberSchema<NonNullable<T>>;
  nullable: () => NumberSchema<T | null>;
  oneOf: <I extends number = number>(
    list: I[],
    options?: Options,
  ) => NumberSchema<InferNullable<T, I>>;
}

function cast(value: unknown): number {
  return value === undefined ? 0 : Number(value);
}

function validateType(): Criteria<number> | void {
  return {
    skipIfNull: true,
    validate(value, path) {
      invariant(typeof value === 'number', 'Must be a number.', path);
    },
  };
}

export function number<T extends number>(defaultValue?: T): NumberSchema<T> {
  return createSchema({
    cast,
    criteria: { ...commonCriteria, ...numberCriteria },
    defaultValue: defaultValue || 0,
    type: 'number',
    validateType,
  });
}
