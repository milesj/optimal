import Builder from './Builder';
import { DefaultValue } from './types';

export default class BooleanBuilder<T extends boolean = boolean> extends Builder<T> {
  constructor(defaultValue?: DefaultValue<T>) {
    super('boolean', defaultValue || (false as T));
  }

  onlyFalse(): BooleanBuilder<false> {
    this.defaultValue = false as T;

    if (__DEV__) {
      this.addCheck((path, value) => {
        this.invariant(value === false, 'May only be `false`.', path);
      });
    }

    return (this as unknown) as BooleanBuilder<false>;
  }

  onlyTrue(): BooleanBuilder<true> {
    this.defaultValue = true as T;

    if (__DEV__) {
      this.addCheck((path, value) => {
        this.invariant(value === true, 'May only be `true`.', path);
      });
    }

    return (this as unknown) as BooleanBuilder<true>;
  }
}

export function bool(defaultValue: DefaultValue<boolean> = false) /* infer */ {
  return new BooleanBuilder<boolean>(defaultValue);
}
