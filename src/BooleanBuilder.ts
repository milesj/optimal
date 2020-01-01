import Builder from './Builder';
import { DefaultValue } from './types';

export default class BooleanBuilder<T extends boolean = boolean> extends Builder<T> {
  constructor(defaultValue?: DefaultValue<T>) {
    super('boolean', defaultValue || (false as T));
  }

  onlyFalse(): BooleanBuilder<false> {
    this.defaultValue = false as T;
    this.addCheck(this.checkOnlyFalse);

    return (this as unknown) as BooleanBuilder<false>;
  }

  checkOnlyFalse(path: string, value: T) {
    if (__DEV__) {
      this.invariant(value === false, 'May only be `false`.', path);
    }
  }

  onlyTrue(): BooleanBuilder<true> {
    this.defaultValue = true as T;
    this.addCheck(this.checkOnlyTrue);

    return (this as unknown) as BooleanBuilder<true>;
  }

  checkOnlyTrue(path: string, value: T) {
    if (__DEV__) {
      this.invariant(value === true, 'May only be `true`.', path);
    }
  }
}

export function bool(defaultValue: DefaultValue<boolean> = false) /* infer */ {
  return new BooleanBuilder<boolean>(defaultValue);
}
