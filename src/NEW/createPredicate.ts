import { Schema, Predicate } from './types';

export default function createPredicate<T>(schema: Schema<T>): Predicate<T> {
  return (value) => {
    try {
      schema.validate(value!);
    } catch {
      return false;
    }

    return true;
  };
}
