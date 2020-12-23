import { SchemaState } from '../types';

/**
 * Disallow null values.
 */
export default function nonNullable<T>(state: SchemaState<T>) {
  state.nullable = false;
}
