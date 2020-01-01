import CollectionBuilder from './CollectionBuilder';

function isString(value: unknown): value is string {
  return typeof value === 'string' && value !== '';
}

export default class StringBuilder<T extends string = string> extends CollectionBuilder<T> {
  constructor(defaultValue?: T) {
    super('string', defaultValue || ('' as T));
  }

  camelCase(): this {
    return this.match(/^[a-z][a-zA-Z0-9]+$/u, 'String must be in camel case.');
  }

  contains(token: string, index: number = 0): this {
    if (__DEV__) {
      this.invariant(isString(token), 'Contains requires a non-empty token.');
    }

    return this.addCheck(this.checkContains, token, index);
  }

  checkContains(path: string, value: T, token: string, index: number = 0) {
    if (__DEV__) {
      if (this.isOptionalDefault(value)) {
        return;
      }

      this.invariant(value.includes(token, index), `String does not include "${token}".`, path);
    }
  }

  kebabCase(): this {
    return this.match(/^[a-z][a-z0-9-]+$/u, 'String must be in kebab case.');
  }

  match(pattern: RegExp, message: string = ''): this {
    if (__DEV__) {
      this.invariant(
        pattern instanceof RegExp,
        'Match requires a regular expression to match against.',
      );
    }

    return this.addCheck(this.checkMatch, pattern, message);
  }

  checkMatch(path: string, value: T, pattern: RegExp, message?: string) {
    if (__DEV__) {
      if (this.isOptionalDefault(value)) {
        return;
      }

      this.invariant(
        !!value.match(pattern),
        `${message || 'String does not match.'} (pattern "${pattern.source}")`,
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

  oneOf<U extends string>(list: U[]): StringBuilder<U> {
    if (__DEV__) {
      this.invariant(
        Array.isArray(list) && list.length > 0 && list.every(item => isString(item)),
        'One of requires a non-empty array of strings.',
      );
    }

    this.addCheck(this.checkOneOf, list);

    return (this as unknown) as StringBuilder<U>;
  }

  checkOneOf(path: string, value: T, list: T[]) {
    if (__DEV__) {
      this.invariant(list.includes(value), `String must be one of: ${list.join(', ')}`, path);
    }
  }

  pascalCase(): this {
    return this.match(/^[A-Z][a-zA-Z0-9]+$/u, 'String must be in pascal case.');
  }

  snakeCase(): this {
    return this.match(/^[a-z][a-z0-9_]+$/u, 'String must be in snake case.');
  }
}

export function string<T extends string = string>(defaultValue?: string) /* infer */ {
  return new StringBuilder<T>(defaultValue as T);
}
