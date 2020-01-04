import Builder from '../src/Builder';
import Schema from '../src/Schema';

export function runChecks<T>(
  builder: Builder<T>,
  value?: Partial<T> | null,
  { key = 'key', struct }: { key?: string; struct?: object } = {},
): T | null {
  const schema = new Schema({});
  schema.struct = struct ?? { [key]: value };

  builder.schema = schema;

  return builder.run(value as T, key, schema);
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
