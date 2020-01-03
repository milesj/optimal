import Builder from '../src/Builder';

export function runChecks<T>(
  builder: Builder<T>,
  value?: Partial<T> | null,
  { key = 'key', struct }: { key?: string; struct?: object } = {},
): T | null {
  return builder.runChecks(key, value as T, struct ?? { [key]: value });
}

export function runInProd(cb: () => unknown) {
  return () => {
    process.env.NODE_ENV = 'production';

    cb();

    process.env.NODE_ENV = 'test';
  };
}
