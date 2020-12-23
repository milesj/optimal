import * as criteria from '../criteria';
import createSchema from '../createSchema';
import { instanceOf, invariant, isObject } from '../helpers';
import { Constructor, CriteriaValidator, CustomCallback, Schema, SchemaState } from '../types';

function refName(ref: Function): string {
  return ref.name || ref.constructor.name;
}

function of<T>(
  state: SchemaState<T>,
  ref?: Constructor<T>,
  loose?: boolean,
): void | CriteriaValidator<T> {
  if (__DEV__) {
    if (ref) {
      invariant(typeof ref === 'function', 'A class reference is required.');
    }

    return (value, path) => {
      if (ref) {
        invariant(
          typeof ref === 'function' &&
            (value instanceof ref || (!!loose && isObject(value) && instanceOf(value, ref))),
          `Must be an instance of "${refName(ref)}".`,
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

export interface InstanceSchema<T> extends Schema<T> {
  and: (...keys: string[]) => InstanceSchema<T>;
  custom: (callback: CustomCallback<T>) => InstanceSchema<T>;
  deprecate: (message: string) => InstanceSchema<T>;
  never: () => InstanceSchema<never>;
  notNullable: () => InstanceSchema<NonNullable<T>>;
  notRequired: () => InstanceSchema<T>;
  nullable: () => InstanceSchema<T | null>;
  only: () => InstanceSchema<T>;
  or: (...keys: string[]) => InstanceSchema<T>;
  required: () => InstanceSchema<T>;
  xor: (...keys: string[]) => InstanceSchema<T>;
  // @internal
  of: (ref?: Constructor<T>, loose?: boolean) => InstanceSchema<T>;
}

const schema = createSchema('instance', { ...criteria, of }, { initialValue: null });

export function instance<T = unknown>(
  ref?: Constructor<T>,
  loose?: boolean,
): InstanceSchema<T | null> {
  const result = (schema(null) as InstanceSchema<T | null>).of(ref, loose).nullable();

  result.typeAlias = ref ? refName(ref) : 'class';

  return result;
}

export function regex() /* infer */ {
  return instance(RegExp);
}

export function date() /* infer */ {
  return instance(Date);
}
