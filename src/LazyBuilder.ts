import Builder from './Builder';
import { OptimalOptions } from './types';

export type Factory<T> = (value: unknown) => Builder<T>;

export default class LazyBuilder<T> extends Builder<T> {
  protected factory: Factory<T>;

  constructor(factory: Factory<T>) {
    super('function', (null as unknown) as T);

    this.factory = factory;

    if (__DEV__) {
      this.invariant(
        typeof factory === 'function',
        'Lazy evaluation requires a factory function that returns a builder.',
      );
    }
  }

  run(value: T | undefined, path: string, struct: object, options: OptimalOptions = {}) {
    if (value === null && this.isNullable) {
      return null;
    }

    const builder = this.factory(value);

    if (__DEV__) {
      this.invariant(builder instanceof Builder, 'Lazy factory returned a non-builder.');
    }

    return builder.run(value, path, struct, options);
  }
}

export function lazy<T>(factory: Factory<T>) /* infer */ {
  return new LazyBuilder(factory);
}
