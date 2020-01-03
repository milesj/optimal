import isObject from './isObject';
import {
  SupportedType,
  CheckerCallback,
  CustomCallback,
  OptimalOptions,
  FuncOf,
  DefaultValue,
  DefaultValueFactory,
} from './types';

export interface TemporalStruct {
  [key: string]: unknown;
}

export default class Builder<T> {
  defaultValue?: T;

  type: SupportedType;

  protected checks: CheckerCallback[] = [];

  protected currentStruct: object = {};

  protected defaultValueFactory?: DefaultValueFactory<T>;

  protected deprecatedMessage: string = '';

  protected errorMessage: string = '';

  protected isNever: boolean = false;

  protected isNullable: boolean = false;

  protected isRequired: boolean = false;

  protected noErrorPrefix: boolean = false;

  protected options: OptimalOptions = {};

  constructor(type: SupportedType, defaultValue: DefaultValue<T>, bypassFactory: boolean = false) {
    if (__DEV__) {
      this.invariant(
        typeof defaultValue !== 'undefined',
        `A default value for type "${type}" is required.`,
      );

      this.addCheck(this.checkType);
    }

    if (typeof defaultValue === 'function' && !bypassFactory) {
      this.defaultValueFactory = defaultValue as DefaultValueFactory<T>;
    } else {
      this.defaultValue = defaultValue as T;
    }

    this.type = type;
  }

  /**
   * Map a list of names that must be defined alongside this field.
   */
  and(...keys: string[]): this {
    if (__DEV__) {
      this.invariant(keys.length > 0, 'AND requires a list of field names.');

      this.addCheck(path => {
        const checkedKeys = [this.key(path), ...keys];
        const struct = this.currentStruct as TemporalStruct;
        const undefs = checkedKeys.filter(
          key => typeof struct[key] === 'undefined' || struct[key] === null,
        );

        // Only error once one of the struct is defined
        if (undefs.length === checkedKeys.length) {
          return;
        }

        this.invariant(
          undefs.length === 0,
          `All of these fields must be defined: ${checkedKeys.join(', ')}`,
        );
      });
    }

    return this;
  }

  /**
   * Cast the value if need be.
   */
  cast(value: unknown): T {
    return value as T;
  }

  /**
   * Set a callback to run custom logic.
   */
  custom<S = object>(callback: CustomCallback<T, S>): this {
    if (__DEV__) {
      this.invariant(
        typeof callback === 'function',
        'Custom blueprints require a validation function.',
      );

      this.addCheck((path, value) => {
        try {
          callback(value, (this.currentStruct as unknown) as S);
        } catch (error) {
          this.invariant(false, error.message, path);
        }
      });
    }

    return this;
  }

  /**
   * Set a message to log when this field is present.
   */
  deprecate(message: string): this {
    if (__DEV__) {
      this.invariant(
        typeof message === 'string' && !!message,
        'A non-empty string is required for deprecated messages.',
      );
    }

    this.deprecatedMessage = message;

    return this;
  }

  /**
   * Throw an error if the condition is falsy.
   */
  invariant(condition: boolean, message: string, path: string = '') {
    if (__DEV__) {
      if (condition) {
        return;
      }

      const { file, name } = this.options;
      const error = this.errorMessage || message;
      let prefix = '';

      if (path) {
        if (name) {
          prefix += `Invalid ${name} field "${path}"`;
        } else {
          prefix += `Invalid field "${path}"`;
        }
      } else if (name) {
        prefix += name;
      }

      if (file) {
        prefix += ` in ${file}`;
      }

      if (prefix && !this.noErrorPrefix) {
        throw new Error(`${prefix}. ${error}`);
      } else {
        throw new Error(error);
      }
    }
  }

  /**
   * Set a custom error message for all checks.
   */
  message(message: string): this {
    if (__DEV__) {
      this.invariant(
        typeof message === 'string' && !!message,
        'A non-empty string is required for custom messages.',
      );
    }

    this.errorMessage = message;

    return this;
  }

  /**
   * Field should never be used.
   */
  never(): Builder<never> {
    this.defaultValue = (undefined as unknown) as T;
    this.isNever = true;

    return (this as unknown) as Builder<never>;
  }

  /**
   * Disallow null values.
   */
  notNullable(): Builder<NonNullable<T>> {
    this.isNullable = false;

    return (this as unknown) as Builder<NonNullable<T>>;
  }

  /**
   * Allow null values.
   */
  nullable(): Builder<T | null> {
    this.isNullable = true;

    return (this as unknown) as Builder<T | null>;
  }

  /**
   * Mark a field as only the default value can be used.
   */
  only(): this {
    if (__DEV__) {
      const defaultValue = this.getDefaultValue(this.currentStruct);

      this.invariant(
        // eslint-disable-next-line valid-typeof
        typeof defaultValue === this.type,
        `Only requires a default ${this.type} value.`,
      );

      this.addCheck((path, value) => {
        this.invariant(
          value === defaultValue,
          `Value may only be "${String(defaultValue)}".`,
          path,
        );
      });
    }

    return this;
  }

  /**
   * Map a list of field names that must have at least 1 defined.
   */
  or(...keys: string[]): this {
    if (__DEV__) {
      this.invariant(keys.length > 0, 'OR requires a list of field names.');

      this.addCheck(path => {
        const orKeys = [this.key(path), ...keys];
        const struct = this.currentStruct as TemporalStruct;
        const defs = orKeys.filter(
          key => typeof struct[key] !== 'undefined' && struct[key] !== null,
        );

        this.invariant(
          defs.length > 0,
          `At least one of these fields must be defined: ${orKeys.join(', ')}`,
        );
      });
    }

    return this;
  }

  /**
   * Require an object property to be explicitly defined.
   */
  required(state: boolean = true): this {
    this.isRequired = state;

    return this;
  }

  /**
   * Run all validation checks that have been enqueued.
   */
  runChecks(
    path: string,
    initialValue: T | undefined,
    struct: object,
    options: OptimalOptions = {},
  ): T | null {
    this.currentStruct = struct;
    this.options = options;
    this.defaultValue = this.getDefaultValue(struct);

    let value = initialValue;

    // Handle undefined
    if (typeof value === 'undefined') {
      if (!this.isRequired) {
        value = this.defaultValue;
      } else if (__DEV__) {
        this.invariant(false, 'Field is required and must be defined.', path);
      }
    } else if (__DEV__) {
      if (this.deprecatedMessage) {
        // eslint-disable-next-line no-console
        console.info(`Field "${path}" is deprecated. ${this.deprecatedMessage}`);
      }

      if (this.isNever) {
        this.invariant(false, 'Field should never be used.', path);
      }
    }

    // Handle null
    if (value === null) {
      if (this.isNullable) {
        return value;
      }

      if (__DEV__) {
        this.invariant(false, 'Null is not allowed.', path);
      }
    }

    // Run all checks against the value
    this.checks.forEach(checker => {
      const result = checker.call(this, path, value);

      if (typeof result !== 'undefined') {
        value = result as T;
      }
    });

    if (value !== null) {
      value = this.cast(value);
    }

    return value;
  }

  /**
   * Return a human readable type name.
   */
  typeAlias(): string {
    return this.type;
  }

  /**
   * Map a list of field names that must not be defined alongside this field.
   */
  xor(...keys: string[]): this {
    if (__DEV__) {
      this.invariant(keys.length > 0, 'XOR requires a list of field names.');

      this.addCheck(path => {
        const xorKeys = [this.key(path), ...keys];
        const struct = this.currentStruct as TemporalStruct;
        const defs = xorKeys.filter(
          key => typeof struct[key] !== 'undefined' && struct[key] !== null,
        );

        this.invariant(
          defs.length === 1,
          `Only one of these fields may be defined: ${xorKeys.join(', ')}`,
        );
      });
    }

    return this;
  }

  /**
   * Add a checking function with optional arguments.
   */
  protected addCheck(checker: CheckerCallback): this {
    this.checks.push(checker);

    return this;
  }

  /**
   * Validate the type of value.
   */
  protected checkType(path: string, value: T) {
    if (__DEV__) {
      switch (this.type) {
        case 'array':
          this.invariant(Array.isArray(value), 'Must be an array.', path);
          break;

        case 'custom':
        case 'instance':
        case 'union':
          // Handle in the sub-class
          break;

        case 'object':
        case 'shape':
          this.invariant(isObject(value), 'Must be a plain object.', path);
          break;

        default:
          // eslint-disable-next-line valid-typeof
          this.invariant(typeof value === this.type, `Must be a ${this.type}.`, path);
          break;
      }
    }
  }

  /**
   * Return the possible default value.
   */
  protected getDefaultValue(struct: object) {
    if (this.defaultValueFactory) {
      return this.defaultValueFactory(struct);
    }

    return this.defaultValue;
  }

  /**
   * Return true if the value matches the default value and the builder is optional.
   */
  protected isOptionalDefault(value: unknown): boolean {
    return !this.isRequired && value === this.getDefaultValue(this.currentStruct);
  }

  /**
   * Return the current key from a path.
   */
  protected key(path: string): string {
    const index = path.lastIndexOf('.');

    return index > 0 ? path.slice(index + 1) : path;
  }
}

export function custom<T, S = object>(
  callback: CustomCallback<T, S>,
  defaultValue: DefaultValue<T>,
) /* infer */ {
  return new Builder<T>('custom', defaultValue).custom(callback);
}

export function func<T = FuncOf>(defaultValue: T | null = null) /* infer */ {
  return new Builder<T | null>('function', defaultValue, true).nullable();
}
