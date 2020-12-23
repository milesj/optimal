import { SchemaState } from '../types';

/**
 * Require this field to NOT be explicitly defined.
 */
export default function nonRequired<T>(state: SchemaState<T>) {
  state.required = false;
}
