import { commonCriteria } from '../criteria';
import createSchema from '../createSchema';
import { invariant } from '../helpers';
import { CriteriaValidator, CommonCriteria, Schema, SchemaState } from '../types';

function onlyFalse(state: SchemaState<boolean>): void | CriteriaValidator<boolean> {
  state.defaultValue = false;
  // this.defaultValueFactory = undefined; TODO

  if (__DEV__) {
    return (value, path) => {
      invariant(value === false, 'May only be `false`.', path);
    };
  }
}

function onlyTrue(state: SchemaState<boolean>): void | CriteriaValidator<boolean> {
  state.defaultValue = true;
  // this.defaultValueFactory = undefined; TODO

  if (__DEV__) {
    return (value, path) => {
      invariant(value === true, 'May only be `true`.', path);
    };
  }
}

export interface BoolSchema<T = boolean>
  extends Schema<T>,
    CommonCriteria<T, BoolSchema<T>, BoolSchema<T | null>, BoolSchema<NonNullable<T>>> {
  onlyFalse: () => BoolSchema<T>;
  onlyTrue: () => BoolSchema<T>;
}

export const bool = createSchema<boolean, BoolSchema>(
  'boolean',
  { ...commonCriteria, onlyFalse, onlyTrue },
  {
    cast: Boolean,
    initialValue: false,
  },
);
