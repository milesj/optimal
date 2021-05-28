import { Predicate, Schema } from './types';

export function createPredicate<T>(schema: Schema<T>): Predicate<T> {
  return (value) => {
    try {
      schema.validate(value);
    } catch {
      return false;
    }

    return true;
  };
}
