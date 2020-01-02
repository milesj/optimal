import Builder from '../src/Builder';

export function runChecks<T>(
  builder: Builder<T>,
  value?: Partial<T>,
  { key = 'key', struct }: { key?: string; struct?: object } = {},
): T | null {
  return builder.runChecks(key, value as T, struct ?? { [key]: value });
}
