import Builder from '../src/Builder';

export function runChecks<T>(
  builder: Builder<T>,
  value?: Partial<T> | null,
  { key = 'key', struct }: { key?: string; struct?: object } = {},
): T | null {
  return builder.run(value as T, key, struct ?? { [key]: value });
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
