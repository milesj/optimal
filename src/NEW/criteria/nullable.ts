import { SchemaState } from '../types';

/**
 * Allow null values.
 */
export default function nullable<T>(state: SchemaState<T>) {
  state.nullable = true;
}
