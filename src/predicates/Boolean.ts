import Predicate from '../Predicate';
import { DefaultValue, NonUndefined } from '../types';

export default class BooleanPredicate<T extends boolean = boolean> extends Predicate<T> {
  constructor(defaultValue?: DefaultValue<T>) {
    super('boolean', defaultValue || (false as T));
  }

  cast(value: unknown): NonUndefined<T> {
    return Boolean(value) as NonUndefined<T>;
  }

  onlyFalse(): BooleanPredicate<false> {
    this.defaultValue = false as T;
    this.defaultValueFactory = undefined;

    if (__DEV__) {
      this.addCheck((path, value) => {
        this.invariant(value === false, 'May only be `false`.', path);
      });
    }

    return (this as unknown) as BooleanPredicate<false>;
  }

  onlyTrue(): BooleanPredicate<true> {
    this.defaultValue = true as T;
    this.defaultValueFactory = undefined;

    if (__DEV__) {
      this.addCheck((path, value) => {
        this.invariant(value === true, 'May only be `true`.', path);
      });
    }

    return (this as unknown) as BooleanPredicate<true>;
  }
}

export function bool(defaultValue: DefaultValue<boolean> = false) /* infer */ {
  return new BooleanPredicate<boolean>(defaultValue);
}
