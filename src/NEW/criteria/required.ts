import { SchemaState } from '../types';

/**
 * Require this field to be explicitly defined.
 */
export default function required<T>(state: SchemaState<T>) {
  state.required = true;
}
