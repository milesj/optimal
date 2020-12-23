import * as checks from '../checks';
import createPredicate from '../createPredicate';
import { invariant } from '../helpers';
import { CheckerCallback, CustomCallback, Predicate, PredicateState } from '../types';

function onlyFalse(state: PredicateState<boolean>): void | CheckerCallback<boolean> {
  state.defaultValue = false;
  // this.defaultValueFactory = undefined; TODO

  if (__DEV__) {
    return (value, path) => {
      invariant(value === false, 'May only be `false`.', path);
    };
  }
}

function onlyTrue(state: PredicateState<boolean>): void | CheckerCallback<boolean> {
  state.defaultValue = true;
  // this.defaultValueFactory = undefined; TODO

  if (__DEV__) {
    return (value, path) => {
      invariant(value === true, 'May only be `true`.', path);
    };
  }
}

export interface BoolPredicate<T> extends Predicate<T> {
  and: (...keys: string[]) => BoolPredicate<T>;
  custom: (callback: CustomCallback<T>) => BoolPredicate<T>;
  deprecate: (message: string) => BoolPredicate<T>;
  never: () => BoolPredicate<never>;
  notNullable: () => BoolPredicate<NonNullable<T>>;
  notRequired: () => BoolPredicate<T>;
  nullable: () => BoolPredicate<T | null>;
  only: () => BoolPredicate<T>;
  or: (...keys: string[]) => BoolPredicate<T>;
  required: () => BoolPredicate<T>;
  xor: (...keys: string[]) => BoolPredicate<T>;
  // Custom
  onlyFalse: () => BoolPredicate<T>;
  onlyTrue: () => BoolPredicate<T>;
}

export const bool = createPredicate<boolean, BoolPredicate<boolean>>(
  'boolean',
  { ...checks, onlyFalse, onlyTrue },
  false,
  Boolean,
);
