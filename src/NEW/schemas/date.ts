import { commonCriteria, dateCriteria } from '../criteria';
import createSchema from '../createSchema';
import { createDate, invariant, isValidDate } from '../helpers';
import { CommonCriterias, DateCriterias, Schema } from '../types';

export interface DateSchema<T = Date>
  extends Schema<T>,
    DateCriterias<DateSchema<T>>,
    CommonCriterias<DateSchema<T>> {
  notNullable: () => DateSchema<NonNullable<T>>;
  nullable: () => DateSchema<T | null>;
}

function validateType(value: unknown, path: string) {
  const time = createDate(value);

  invariant(
    isValidDate(time),
    'Must be a string, number, or Date that resolves to a valid Date.',
    path,
  );

  return time;
}

export function date(defaultValue?: Date): DateSchema<Date> {
  return createSchema({
    cast: createDate,
    criteria: { ...commonCriteria, ...dateCriteria },
    defaultValue,
    type: 'date',
    validateType,
  });
}
