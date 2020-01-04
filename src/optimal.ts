import Schema from './Schema';
import isObject from './isObject';
import { Blueprint, OptimalOptions } from './types';

export default function optimal<
  Struct extends object,
  Construct extends object = { [K in keyof Struct]?: unknown }
>(struct: Construct, blueprint: Blueprint<Struct>, options: OptimalOptions = {}): Required<Struct> {
  if (__DEV__) {
    if (!isObject(options)) {
      throw new TypeError('Optimal options must be a plain object.');
    }
  }

  const schema = new Schema(blueprint);

  if (options.name) {
    schema.setName(options.name);
  }

  if (options.file) {
    schema.setFile(options.file);
  }

  if (options.unknown) {
    schema.allowUnknown();
  }

  return schema.build(struct, options.prefix);
}
