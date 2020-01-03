import Builder from './Builder';
import isObject from './isObject';
import typeOf from './typeOf';
import { SchemaOptions, Blueprint } from './types';

export default class Schema<T extends object> {
  blueprint: Blueprint<T>;

  options: SchemaOptions;

  constructor(blueprint: Blueprint<T>, options: SchemaOptions = {}) {
    if (__DEV__) {
      if (!isObject(blueprint)) {
        throw new TypeError('A schema blueprint is required.');
      } else if (!isObject(options)) {
        throw new TypeError('Schema options must be a plain object.');
      }
    }

    this.blueprint = blueprint;
    this.options = options;
  }

  build(struct: Partial<T>): Required<T> {
    if (__DEV__) {
      if (!isObject(struct)) {
        throw new TypeError(`Schema requires a plain object, found ${typeOf(struct)}.`);
      }
    }

    const { prefix } = this.options;
    const unknownFields: Partial<T> = { ...struct };
    const builtStruct: Partial<T> = {};

    // Validate using the blueprint
    Object.keys(this.blueprint).forEach(baseKey => {
      const key = baseKey as keyof T;
      const value = struct[key];
      const builder = this.blueprint[key];
      const path = String(prefix ? `${prefix}.${key}` : key);

      // Run validation checks and support both v1 and v2
      if (
        builder instanceof Builder ||
        (isObject(builder) && (builder as Function).constructor.name.endsWith('Builder'))
      ) {
        builtStruct[key] = builder.run(value, path, struct, this.options)!;

        // Oops
      } else if (__DEV__) {
        throw new Error(`Unknown blueprint for "${path}". Must be a builder.`);
      }

      // Delete the prop and mark it as known
      delete unknownFields[key];
    });

    // Handle unknown options
    if (this.options.unknown) {
      Object.assign(builtStruct, unknownFields);
    } else if (__DEV__) {
      const unknownKeys = Object.keys(unknownFields);

      if (unknownKeys.length > 0) {
        const message = prefix ? `Unknown "${prefix}" fields` : 'Unknown fields';

        throw new Error(`${message}: ${unknownKeys.join(', ')}.`);
      }
    }

    return builtStruct as Required<T>;
  }
}
