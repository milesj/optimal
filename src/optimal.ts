import Builder from './Builder';
import isObject from './isObject';
import typeOf from './typeOf';
import { Blueprint, OptimalOptions } from './types';

function buildAndCheck<Struct extends object>(
  blueprint: Blueprint<Struct>,
  struct: Partial<Struct>,
  options: OptimalOptions = {},
  parentPath: string = '',
): any {
  const unknownFields: any = { ...struct };
  const builtStruct: any = {};

  // Validate using the blueprint
  Object.keys(blueprint).forEach(baseKey => {
    const key = baseKey as keyof Struct;
    const value = struct[key];
    const builder = blueprint[key];
    const path = String(parentPath ? `${parentPath}.${key}` : key);

    // Run validation checks and support both v1 and v2
    if (
      builder instanceof Builder ||
      (isObject(builder) && (builder as any).constructor.name.endsWith('Builder'))
    ) {
      builtStruct[key] = builder.runChecks(path, value, struct, options);

      // Oops
    } else if (__DEV__) {
      throw new Error(`Unknown blueprint for "${path}". Must be a builder.`);
    }

    // Delete the prop and mark it as known
    delete unknownFields[key];
  });

  // Handle unknown options
  if (options.unknown) {
    // eslint-disable-next-line compat/compat
    Object.assign(builtStruct, unknownFields);
  } else if (__DEV__) {
    const unknownKeys = Object.keys(unknownFields);

    if (unknownKeys.length > 0) {
      throw new Error(`Unknown fields: ${unknownKeys.join(', ')}.`);
    }
  }

  return builtStruct;
}

export default function optimal<
  Struct extends object,
  Construct extends object = { [K in keyof Struct]?: unknown }
>(struct: Construct, blueprint: Blueprint<Struct>, options: OptimalOptions = {}): Required<Struct> {
  if (__DEV__) {
    if (!isObject(struct)) {
      throw new TypeError(`Optimal requires a plain object, found ${typeOf(struct)}.`);
    } else if (!isObject(options)) {
      throw new TypeError('Optimal options must be a plain object.');
    } else if (!isObject(blueprint)) {
      throw new TypeError('A blueprint is required.');
    }
  }

  return buildAndCheck(blueprint, struct, options);
}
