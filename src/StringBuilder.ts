import Builder from './Builder';

function isString(value: unknown): value is string {
  return typeof value === 'string' && value !== '';
}

export default class StringBuilder<T extends string = string> extends Builder<T> {
  constructor(defaultValue?: T) {
    super('string', defaultValue || ('' as T));
  }

  contains(token: string, index: number = 0): this {
    if (__DEV__) {
      this.invariant(isString(token), 'Contains requires a non-empty string.');
    }

    return this.addCheck(this.checkContains, token, index);
  }

  checkContains(path: string, value: T, token: string, index: number = 0) {
    if (__DEV__) {
      this.invariant(value.includes(token, index), `String does not include "${token}".`, path);
    }
  }

  match(pattern: RegExp): this {
    if (__DEV__) {
      this.invariant(
        pattern instanceof RegExp,
        'Match requires a regular expression to match against.',
      );
    }

    return this.addCheck(this.checkMatch, pattern);
  }

  checkMatch(path: string, value: T, pattern: RegExp) {
    if (__DEV__) {
      this.invariant(
        !!value.match(pattern),
        `String does not match pattern "${pattern.source}".`,
        path,
      );
    }
  }

  notEmpty(): this {
    return this.addCheck(this.checkNotEmpty);
  }

  checkNotEmpty(path: string, value: T) {
    if (__DEV__) {
      this.invariant(isString(value), 'String cannot be empty.', path);
    }
  }

  oneOf<U extends string>(list: U[]) /* refine */ {
    if (__DEV__) {
      this.invariant(
        Array.isArray(list) && list.length > 0 && list.every(item => isString(item)),
        'One of requires a non-empty array of strings.',
      );
    }

    this.addCheck(this.checkOneOf, list);

    return (this as any) as StringBuilder<U>;
  }

  checkOneOf(path: string, value: T, list: T[]) {
    if (__DEV__) {
      this.invariant(list.includes(value), `String must be one of: ${list.join(', ')}`, path);
    }
  }
}

export function string<T extends string = string>(defaultValue?: string) /* infer */ {
  return new StringBuilder<T>(defaultValue as T);
}
