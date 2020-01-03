import Builder from './Builder';
import { DefaultValue } from './types';

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

export default class NumberBuilder<T extends number = number> extends Builder<T> {
  constructor(defaultValue?: DefaultValue<T>) {
    super('number', defaultValue || (0 as T));
  }

  between(min: number, max: number, inclusive: boolean = false): this {
    if (__DEV__) {
      this.invariant(
        isNumber(min) && isNumber(max),
        'Between requires a minimum and maximum number.',
      );

      this.addCheck((path, value) => {
        this.invariant(
          isNumber(value) &&
            (inclusive ? value >= min && value <= max : value > min && value < max),
          `Number must be between ${min} and ${max}${inclusive ? ' inclusive' : ''}.`,
          path,
        );
      });
    }

    return this;
  }

  cast(value: unknown): T {
    return Number(value) as T;
  }

  float(): this {
    if (__DEV__) {
      this.addCheck((path, value) => {
        this.invariant(isNumber(value) && value % 1 !== 0, 'Number must be a float.', path);
      });
    }

    return this;
  }

  gt(min: number, inclusive: boolean = false): this {
    if (__DEV__) {
      this.invariant(isNumber(min), 'Greater-than requires a minimum number.');

      this.addCheck((path, value) => {
        if (inclusive) {
          this.invariant(
            isNumber(value) && value >= min,
            `Number must be greater than or equal to ${min}.`,
            path,
          );
        } else {
          this.invariant(
            isNumber(value) && value > min,
            `Number must be greater than ${min}.`,
            path,
          );
        }
      });
    }

    return this;
  }

  gte(min: number): this {
    return this.gt(min, true);
  }

  int(): this {
    if (__DEV__) {
      this.addCheck((path, value) => {
        this.invariant(Number.isSafeInteger(value), 'Number must be an integer.', path);
      });
    }

    return this;
  }

  lt(max: number, inclusive: boolean = false): this {
    if (__DEV__) {
      this.invariant(isNumber(max), 'Less-than requires a maximum number.');

      this.addCheck((path, value) => {
        if (inclusive) {
          this.invariant(
            isNumber(value) && value <= max,
            `Number must be less than or equal to ${max}.`,
            path,
          );
        } else {
          this.invariant(isNumber(value) && value < max, `Number must be less than ${max}.`, path);
        }
      });
    }

    return this;
  }

  lte(max: number): this {
    return this.lt(max, true);
  }

  negative(): this {
    if (__DEV__) {
      this.addCheck((path, value) => {
        this.invariant(isNumber(value) && value < 0, 'Number must be negative.', path);
      });
    }

    return this;
  }

  oneOf<U extends number>(list: U[]): NumberBuilder<U> {
    if (__DEV__) {
      this.invariant(
        Array.isArray(list) && list.length > 0 && list.every(item => isNumber(item)),
        'One of requires a non-empty array of numbers.',
      );

      this.addCheck((path, value) => {
        this.invariant(list.includes(value), `Number must be one of: ${list.join(', ')}`, path);
      });
    }

    return (this as unknown) as NumberBuilder<U>;
  }

  positive(): this {
    if (__DEV__) {
      this.addCheck((path, value) => {
        this.invariant(isNumber(value) && value > 0, 'Number must be positive.', path);
      });
    }

    return this;
  }
}

export function number<T extends number = number>(defaultValue?: DefaultValue<number>) /* infer */ {
  return new NumberBuilder<T>(defaultValue as T);
}
