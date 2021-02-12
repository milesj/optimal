import isObject from './isObject';
import logUnknown from './logUnknown';
import Predicate from './Predicate';
import typeOf from './typeOf';
import { Blueprint } from './types';

export default class Schema<T extends object> {
  // Strict blueprint of predicates
  blueprint: Blueprint<T>;

  // Path of the current value being checked
  currentPath: string = '';

  // Current value being checked
  currentValue: unknown = null;

  // File path for debug messages
  filePath: string = '';

  // Initial struct value passed to build
  initialStruct: Partial<T> = {};

  // Path of the parent value
  parentPath: string = '';

  // Partial parent struct to the current value being built
  parentStruct: unknown = {};

  // Partial struct currently being built
  struct: Partial<T> = {};

  // Unique name for debug messages
  schemaName: string = '';

  // Allow unknown fields not found in the blueprint
  unknown: boolean = false;

  constructor(blueprint: Blueprint<T>) {
    if (__DEV__) {
      if (!isObject(blueprint)) {
        throw new TypeError('A schema blueprint is required.');
      }
    }

    this.blueprint = blueprint;
  }

  /**
   * Allow unknown fields in the schema struct.
   */
  allowUnknown(): this {
    this.unknown = true;

    return this;
  }

  /**
   * Recursively validation and build the schema object based on the blueprint.
   */
  build(struct: Partial<T>, pathPrefix: string = ''): Required<T> {
    if (__DEV__) {
      if (!isObject(struct)) {
        throw new TypeError(`Schema requires a plain object, found ${typeOf(struct)}.`);
      }
    }

    this.initialStruct = { ...struct };
    this.struct = { ...struct };

    const unknownFields: Partial<T> = { ...struct };

    // Validate using the blueprint
    Object.keys(this.blueprint).forEach((baseKey) => {
      const key = baseKey as keyof T;
      const value = struct[key];
      const predicate = this.blueprint[key];
      const path = String(pathPrefix ? `${pathPrefix}.${key}` : key);

      // Run validation checks and support both v1 and v2
      if (
        predicate instanceof Predicate ||
        (isObject(predicate) && (predicate as Function).constructor.name.endsWith('Predicate'))
      ) {
        this.parentPath = baseKey;
        this.parentStruct = this.initialStruct;
        this.struct[key] = predicate.run(value, path, this)!;

        // Oops
      } else if (__DEV__) {
        throw new Error(`Unknown blueprint for "${path}". Must be a predicate.`);
      }

      // Delete the prop and mark it as known
      delete unknownFields[key];
    });

    // Handle unknown options
    if (this.unknown) {
      Object.assign(this.struct, unknownFields);
    } else if (__DEV__) {
      logUnknown(unknownFields, pathPrefix);
    }

    return this.struct as Required<T>;
  }

  /**
   * Set a unique file name or path for this schema to appear in error messages.
   */
  setFile(name: string): this {
    this.filePath = name;

    return this;
  }

  /**
   * Set a unique name for this schema to appear in error messages.
   */
  setName(name: string): this {
    this.schemaName = name;

    return this;
  }
}
