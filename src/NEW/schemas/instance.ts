import { commonCriteria } from '../criteria';
import createSchema from '../createSchema';
import { instanceOf, invariant, isObject } from '../helpers';
import { Constructor, CriteriaState, CommonCriteria, Schema, SchemaState } from '../types';

function refName(ref: Function): string {
  return ref.name || ref.constructor.name;
}

function of<T>(
  state: SchemaState<T>,
  ref?: Constructor<T>,
  loose?: boolean,
): void | CriteriaState<T> {
  if (__DEV__) {
    if (ref) {
      invariant(typeof ref === 'function', 'A class reference is required.');
    }

    return {
      skipIfNull: true,
      validate(value, path) {
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
      },
    };
  }
}

export interface InstanceSchema<T>
  extends Schema<T>,
    CommonCriteria<T, InstanceSchema<T>, InstanceSchema<T | null>, InstanceSchema<NonNullable<T>>> {
  // @internal
  of: (ref?: Constructor<T>, loose?: boolean) => InstanceSchema<T>;
}

const schema = createSchema('instance', { ...commonCriteria, of }, { initialValue: null });

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
