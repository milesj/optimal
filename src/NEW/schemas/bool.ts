import * as criteria from '../criteria';
import createSchema from '../createSchema';
import { invariant } from '../helpers';
import { CriteriaValidator, CustomCallback, Schema, SchemaState } from '../types';

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

export interface BoolSchema<T = boolean> extends Schema<T> {
  and: (...keys: string[]) => BoolSchema<T>;
  custom: (callback: CustomCallback<T>) => BoolSchema<T>;
  deprecate: (message: string) => BoolSchema<T>;
  never: () => BoolSchema<never>;
  notNullable: () => BoolSchema<NonNullable<T>>;
  notRequired: () => BoolSchema<T>;
  nullable: () => BoolSchema<T | null>;
  only: () => BoolSchema<T>;
  or: (...keys: string[]) => BoolSchema<T>;
  required: () => BoolSchema<T>;
  xor: (...keys: string[]) => BoolSchema<T>;
  // Custom
  onlyFalse: () => BoolSchema<T>;
  onlyTrue: () => BoolSchema<T>;
}

export const bool = createSchema<boolean, BoolSchema>(
  'boolean',
  { ...criteria, onlyFalse, onlyTrue },
  {
    cast: Boolean,
    initialValue: false,
  },
);
