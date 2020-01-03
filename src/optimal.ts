import { Blueprint, SchemaOptions } from './types';
import Schema from './Schema';

export default function optimal<
  Struct extends object,
  Construct extends object = { [K in keyof Struct]?: unknown }
>(struct: Construct, blueprint: Blueprint<Struct>, options: SchemaOptions = {}): Required<Struct> {
  return new Schema(blueprint, options).build(struct);
}
