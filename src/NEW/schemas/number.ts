import { commonCriteria, numberCriteria } from '../criteria';
import createSchema from '../createSchema';
import { CommonCriteria, NumberCriteria, Schema } from '../types';

export interface NumberSchema<T = number>
  extends Schema<T>,
    NumberCriteria<Schema<T>>,
    CommonCriteria<T, NumberSchema<T>, NumberSchema<T | null>, NumberSchema<NonNullable<T>>> {}

function cast(value: unknown): number {
  return value === undefined ? 0 : Number(value);
}

export const number = createSchema<number, NumberSchema>(
  'number',
  { ...commonCriteria, ...numberCriteria },
  {
    cast,
    initialValue: 0,
  },
);
