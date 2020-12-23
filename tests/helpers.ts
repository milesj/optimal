import { Schema, UnknownObject } from '../src/NEW/types';

export function runChecks<T>(
  predicate: Schema<T>,
  value?: Partial<T> | null,
  { key = 'key', struct }: { key?: string; struct?: UnknownObject } = {},
): T | null {
  // const schema = predicate.schema || new Schema({});
  // const currentStruct = struct ?? { [key]: value };
  // schema.struct = { ...currentStruct };
  // schema.parentStruct = { ...currentStruct };
  // schema.initialStruct = { ...currentStruct };
  // predicate.schema = schema;
  // return predicate.run(value as T, key, schema);

  const currentObject = struct ?? { [key]: value };

  return predicate.validate(value as T, key, currentObject);
}

export function runInProd(cb: () => unknown) {
  return () => {
    process.env.NODE_ENV = 'production';

    try {
      cb();
    } finally {
      process.env.NODE_ENV = 'test';
    }
  };
}
