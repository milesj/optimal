import Builder from '../src/Builder';

export function runChecks<T>(builder: Builder<T>, value?: T): T {
  return builder.runChecks('key', value, { key: value });
}
