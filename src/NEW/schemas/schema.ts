import { isSchema } from '../helpers';
import { Schema } from '../types';
import { object } from './object';

export function schema() {
  // TODO switch to shape
  return object().custom((value) => {
    if (!isSchema(value)) {
      throw new Error(
        'Value provided is not an optimal schema. Must contain a `validate()` method and `typeAlias` property.',
      );
    }
  });
}

export function blueprint<T = unknown, K extends string = string>(
  defaultValue?: Record<K, Schema<T>>,
) /* infer */ {
  return object(defaultValue).of(schema().notNullable());
}
