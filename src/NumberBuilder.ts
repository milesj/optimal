import Builder from './Builder';

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export default class NumberBuilder<T extends number = number> extends Builder<T> {
  constructor(defaultValue?: T) {
    super('number', defaultValue || (0 as T));
  }

  between(min: number, max: number, inclusive: boolean = false): this {
    if (__DEV__) {
      this.invariant(
        isNumber(min) && isNumber(max),
        'Between requires a minimum and maximum number.',
      );
    }

    return this.addCheck(this.checkBetween, min, max, inclusive);
  }

  checkBetween(path: string, value: T, min: number, max: number, inclusive: boolean = false) {
    if (__DEV__) {
      this.invariant(
        isNumber(value) && (inclusive ? value >= min && value <= max : value > min && value < max),
        `Number must be between ${min} and ${max}${inclusive ? ' inclusive' : ''}.`,
        path,
      );
    }
  }

  gt(min: number, inclusive: boolean = false): this {
    if (__DEV__) {
      this.invariant(isNumber(min), 'Greater-than requires a minimum number.');
    }

    return this.addCheck(this.checkGreaterThan, min, inclusive);
  }

  gte(min: number): this {
    return this.gt(min, true);
  }

  checkGreaterThan(path: string, value: T, min: number, inclusive: boolean = false) {
    if (__DEV__) {
      if (inclusive) {
        this.invariant(
          isNumber(value) && value >= min,
          `Number must be greater than or equal to ${min}.`,
          path,
        );
      } else {
        this.invariant(isNumber(value) && value > min, `Number must be greater than ${min}.`, path);
      }
    }
  }

  lt(max: number, inclusive: boolean = false): this {
    if (__DEV__) {
      this.invariant(isNumber(max), 'Less-than requires a maximum number.');
    }

    return this.addCheck(this.checkLessThan, max, inclusive);
  }

  lte(max: number): this {
    return this.lt(max, true);
  }

  checkLessThan(path: string, value: T, max: number, inclusive: boolean = false) {
    if (__DEV__) {
      if (inclusive) {
        this.invariant(
          isNumber(value) && value <= max,
          `Number must be less than or equal to ${max}.`,
          path,
        );
      } else {
        this.invariant(isNumber(value) && value < max, `Number must be less than ${max}.`, path);
      }
    }
  }

  oneOf<U extends number>(list: U[]) /* refine */ {
    if (__DEV__) {
      this.invariant(
        Array.isArray(list) && list.length > 0 && list.every(item => isNumber(item)),
        'One of requires a non-empty array of numbers.',
      );
    }

    this.addCheck(this.checkOneOf, list);

    return (this as any) as NumberBuilder<U>;
  }

  checkOneOf(path: string, value: T, list: T[]) {
    if (__DEV__) {
      this.invariant(list.includes(value), `Number must be one of: ${list.join(', ')}`, path);
    }
  }
}

export function number<T extends number = number>(defaultValue?: number) /* infer */ {
  return new NumberBuilder<T>(defaultValue as T);
}
