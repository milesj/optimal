import { Blueprint, UnknownObject } from './types';
import { shape } from './schemas/shape';
import { isObject } from './helpers';
import { ValidationError } from './ValidationError';

export interface OptimalOptions {
  file?: string;
  name?: string;
  prefix?: string;
  unknown?: boolean;
}

export function optimal<
  Struct extends object,
  Construct extends object = { [K in keyof Struct]?: unknown }
>(struct: Construct, blueprint: Blueprint<Struct>, options: OptimalOptions = {}): Required<Struct> {
  if (__DEV__) {
    if (!isObject(options)) {
      throw new TypeError('Optimal options must be a plain object.');
    }
  }

  const schema = shape(blueprint);
  const object = struct as UnknownObject;

  if (!options.unknown) {
    schema.exact();
  }

  try {
    return schema.validate(struct, options.prefix || '', object, object) as Required<Struct>;
  } catch (error) {
    const invalid = error instanceof ValidationError ? error : new ValidationError(error.message);

    if (options.name) {
      invalid.schema = options.name;
    }

    if (options.file) {
      invalid.file = options.file;
    }

    throw invalid;
  }
}
