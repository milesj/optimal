import { commonCriteria, stringCriteria } from '../criteria';
import createSchema from '../createSchema';
import { CommonCriteria, StringCriteria, Schema } from '../types';

export interface StringSchema<T = string>
  extends Schema<T>,
    StringCriteria<Schema<T>>,
    CommonCriteria<T, StringSchema<T>, StringSchema<T | null>, StringSchema<NonNullable<T>>> {}

export const string = createSchema<string, StringSchema>(
  'string',
  { ...commonCriteria, ...stringCriteria },
  {
    cast(value) {
      return value === undefined ? '' : String(value);
    },
    initialValue: '',
  },
);
