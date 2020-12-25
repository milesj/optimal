import { commonCriteria } from '../criteria';
import createSchema from '../createSchema';
import { invariant } from '../helpers';
import { CommonCriterias, Schema } from '../types';

export interface DateSchema<T> extends Schema<T>, CommonCriterias<DateSchema<T>> {
  notNullable: () => DateSchema<NonNullable<T>>;
  nullable: () => DateSchema<T | null>;
}

function cast(value: unknown): Date {
  return value instanceof Date ? value : new Date(value as number);
}

function validateType(value: unknown, path: string) {
  const time = new Date(value as number);

  invariant(
    !Number.isNaN(time.getTime()) && time.toString() !== 'Invalid Date',
    'Must be a string, number, or Date that resolves to a valid Date.',
    path,
  );

  return time;
}

export function date(defaultValue?: Date): DateSchema<Date> {
  return createSchema({
    cast,
    criteria: { ...commonCriteria },
    defaultValue,
    type: 'date',
    validateType,
  });
}
