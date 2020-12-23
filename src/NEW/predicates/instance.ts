import * as checks from '../checks';
import createPredicate from '../createPredicate';
import { instanceOf, invariant, isObject } from '../helpers';
import { Constructor, CheckerCallback, CustomCallback, Predicate, PredicateState } from '../types';

function refName(ref: Function): string {
  return ref.name || ref.constructor.name;
}

function of<T>(
  state: PredicateState<T>,
  refClass?: Constructor<T>,
  loose?: boolean,
): void | CheckerCallback<T> {
  if (__DEV__) {
    if (refClass) {
      invariant(typeof refClass === 'function', 'A class reference is required.');
    }

    return (value, path) => {
      if (refClass) {
        invariant(
          typeof refClass === 'function' &&
            (value instanceof refClass ||
              (!!loose && isObject(value) && instanceOf(value, refClass))),
          `Must be an instance of "${refName(refClass)}".`,
          path,
        );
      } else {
        invariant(
          isObject(value) && value.constructor !== Object,
          'Must be a class instance.',
          path,
        );
      }
    };
  }
}

export interface InstancePredicate<T> extends Predicate<T> {
  and: (...keys: string[]) => InstancePredicate<T>;
  custom: (callback: CustomCallback<T>) => InstancePredicate<T>;
  deprecate: (message: string) => InstancePredicate<T>;
  never: () => InstancePredicate<never>;
  notNullable: () => InstancePredicate<NonNullable<T>>;
  notRequired: () => InstancePredicate<T>;
  nullable: () => InstancePredicate<T | null>;
  only: () => InstancePredicate<T>;
  or: (...keys: string[]) => InstancePredicate<T>;
  required: () => InstancePredicate<T>;
  xor: (...keys: string[]) => InstancePredicate<T>;
  // @internal
  of: (refClass?: Constructor<T>, loose?: boolean) => InstancePredicate<T>;
}

const predicate = createPredicate('instance', { ...checks, of }, { initialValue: null });

export function instance<T = unknown>(
  refClass?: Constructor<T>,
  loose?: boolean,
): InstancePredicate<T | null> {
  const result = (predicate(null) as InstancePredicate<T | null>).of(refClass, loose).nullable();

  result.typeAlias = refClass ? refName(refClass) : 'class';

  return result;
}

export function regex() /* infer */ {
  return instance(RegExp);
}

export function date() /* infer */ {
  return instance(Date);
}
