import CollectionPredicate from './Collection';
import { DefaultValue, NonUndefined } from '../types';

function isString(value: unknown): value is string {
  return typeof value === 'string' && value !== '';
}

export default class StringPredicate<T extends string = string> extends CollectionPredicate<T> {
  constructor(defaultValue?: DefaultValue<T>) {
    super('string', defaultValue || ('' as T));
  }

  camelCase(): this {
    return this.match(/^[a-z][a-zA-Z0-9]+$/u, 'String must be in camel case.');
  }

  cast(value: unknown): NonUndefined<T> {
    return String(value) as NonUndefined<T>;
  }

  contains(token: string, index: number = 0): this {
    if (__DEV__) {
      this.invariant(isString(token), 'Contains requires a non-empty token.');

      this.addCheck((path, value) => {
        if (this.isOptionalDefault(value)) {
          return;
        }

        this.invariant(value.includes(token, index), `String does not include "${token}".`, path);
      });
    }

    return this;
  }

  kebabCase(): this {
    return this.match(/^[a-z][a-z0-9-]+$/u, 'String must be in kebab case.');
  }

  lowerCase(): this {
    if (__DEV__) {
      this.addCheck((path, value) => {
        this.invariant(value === value.toLocaleLowerCase(), 'String must be lower cased.', path);
      });
    }

    return this;
  }

  match(pattern: RegExp, message: string = ''): this {
    if (__DEV__) {
      this.invariant(
        pattern instanceof RegExp,
        'Match requires a regular expression to match against.',
      );

      this.addCheck((path, value) => {
        if (this.isOptionalDefault(value)) {
          return;
        }

        this.invariant(
          !!value.match(pattern),
          `${message || 'String does not match.'} (pattern "${pattern.source}")`,
          path,
        );
      });
    }

    return this;
  }

  notEmpty(): this {
    if (__DEV__) {
      this.addCheck((path, value) => {
        this.invariant(isString(value), 'String cannot be empty.', path);
      });
    }

    return this;
  }

  oneOf<U extends string>(list: U[]): StringPredicate<U> {
    if (__DEV__) {
      this.invariant(
        Array.isArray(list) && list.length > 0 && list.every(item => isString(item)),
        'One of requires a non-empty array of strings.',
      );

      this.addCheck((path, value) => {
        this.invariant(
          list.includes((value as unknown) as U),
          `String must be one of: ${list.join(', ')}`,
          path,
        );
      });
    }

    return (this as unknown) as StringPredicate<U>;
  }

  pascalCase(): this {
    return this.match(/^[A-Z][a-zA-Z0-9]+$/u, 'String must be in pascal case.');
  }

  snakeCase(): this {
    return this.match(/^[a-z][a-z0-9_]+$/u, 'String must be in snake case.');
  }

  upperCase(): this {
    if (__DEV__) {
      this.addCheck((path, value) => {
        this.invariant(value === value.toLocaleUpperCase(), 'String must be upper cased.', path);
      });
    }

    return this;
  }
}

export function string<T extends string = string>(defaultValue?: DefaultValue<string>) /* infer */ {
  return new StringPredicate<T>(defaultValue as T);
}
