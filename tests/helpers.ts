import Predicate from '../src/Predicate';
import Schema from '../src/Schema';

export function runChecks<T>(
  predicate: Predicate<T>,
  value?: Partial<T> | null,
  { key = 'key', struct }: { key?: string; struct?: object } = {},
): T | null {
  const schema = new Schema({});
  schema.struct = struct ?? { [key]: value };

  predicate.schema = schema;

  return predicate.run(value as T, key, schema);
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
