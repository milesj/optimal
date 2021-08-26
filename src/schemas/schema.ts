import { Schema } from '../types';
import { func } from './func';
import { object } from './object';
import { shape } from './shape';

export function schema() {
  return shape({
    type: func().notNullable().required(),
    validate: func().notNullable().required(),
  });
}

export function blueprint<T extends object, K extends string = string>(
  defaultValue?: Record<K, Schema<T>>,
) /* infer */ {
  return object(defaultValue).of(schema().notNullable());
}
