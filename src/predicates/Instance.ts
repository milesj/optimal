import Predicate from '../Predicate';
import isObject from '../isObject';
import instanceOf from '../instanceOf';

// eslint-disable-next-line @typescript-eslint/type-annotation-spacing
export type Constructor<T> = (new (...args: unknown[]) => T) | (Function & { prototype: T });

export default class InstancePredicate<T> extends Predicate<T | null> {
  protected loose: boolean = false;

  protected refClass: Constructor<T> | null = null;

  constructor(refClass: Constructor<T> | null = null, loose: boolean = false) {
    super('instance', null);

    // Nullable by default
    this.nullable();

    if (__DEV__) {
      if (refClass) {
        this.invariant(typeof refClass === 'function', 'A class reference is required.');
      }

      this.loose = loose;
      this.refClass = refClass;

      this.addCheck((path, value) => {
        if (refClass) {
          this.invariant(
            typeof refClass === 'function' &&
              (value instanceof refClass ||
                (this.loose && isObject(value) && instanceOf(value, refClass))),
            `Must be an instance of "${this.typeAlias()}".`,
            path,
          );
        } else {
          this.invariant(
            isObject(value) && value.constructor !== Object,
            'Must be a class instance.',
            path,
          );
        }
      });
    }
  }

  /**
   * If reference class is defined, return the class name if available.
   */
  typeAlias(): string {
    const { refClass } = this;

    return refClass ? refClass.name || refClass.constructor.name : 'class';
  }
}

export function instance<T = Function>(
  refClass: Constructor<T> | null = null,
  loose?: boolean,
) /* infer */ {
  return new InstancePredicate<T>(refClass, loose);
}

export function predicate<T = unknown>() /* infer */ {
  return instance<Predicate<T>>(Predicate);
}

export function regex() /* infer */ {
  return instance(RegExp);
}

export function date() /* infer */ {
  return instance(Date);
}
