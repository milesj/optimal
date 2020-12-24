import { commonCriteria, numberCriteria } from '../criteria';
import createSchema from '../createSchema';
import { CommonCriterias, InferNullable, NumberCriterias, Schema } from '../types';
import { invariant } from '../helpers';

export interface NumberSchema<T = number>
  extends Schema<T>,
    NumberCriterias<NumberSchema<T>>,
    CommonCriterias<NumberSchema<T>> {
  notNullable: () => NumberSchema<NonNullable<T>>;
  nullable: () => NumberSchema<T | null>;
  oneOf: <I extends number>(list: I[]) => NumberSchema<InferNullable<T, I>>;
}

function cast(value: unknown): number {
  return value === undefined ? 0 : Number(value);
}

function validateType(value: unknown, path: string) {
  invariant(typeof value === 'number', 'Must be a number.', path);
}

export function number(defaultValue: number = 0): NumberSchema<number> {
  return createSchema({
    cast,
    criteria: { ...commonCriteria, ...numberCriteria },
    defaultValue,
    type: 'number',
    validateType,
  });
}
