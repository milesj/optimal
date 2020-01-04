import Builder from './Builder';

export type InferTupleContents<T> = T extends [infer A, infer B, infer C, infer D, infer E]
  ? [Builder<A>, Builder<B>, Builder<C>, Builder<D>, Builder<E>]
  : T extends [infer A, infer B, infer C, infer D]
  ? [Builder<A>, Builder<B>, Builder<C>, Builder<D>]
  : T extends [infer A, infer B, infer C]
  ? [Builder<A>, Builder<B>, Builder<C>]
  : T extends [infer A, infer B]
  ? [Builder<A>, Builder<B>]
  : T extends [infer A]
  ? [Builder<A>]
  : never;

export default class TupleBuilder<T extends unknown[] = unknown[]> extends Builder<T> {
  protected contents: InferTupleContents<T>;

  constructor(contents: InferTupleContents<T>) {
    super('tuple', ([] as unknown) as T);

    if (__DEV__) {
      this.invariant(
        Array.isArray(contents) &&
          contents.length > 0 &&
          contents.every(content => content instanceof Builder),
        'A non-empty array of blueprints are required for a tuple.',
      );
    }

    this.contents = contents;
  }

  run(value: T | undefined, path: string): T | null {
    if (__DEV__) {
      if (value) {
        this.invariant(
          Array.isArray(value) && value.length <= this.contents.length,
          `Value must be a tuple with less than or equal to ${this.contents.length} items.`,
        );
      }
    }

    const nextValue = value ? [...value] : [];

    this.contents.forEach((content, i) => {
      nextValue[i] = content.run(nextValue[i], `${path}[${i}]`, this.schema!)!;
    });

    return nextValue as T;
  }

  /**
   * Return the type name as an array of type items.
   */
  typeAlias(): string {
    return `[${this.contents.map(item => item.typeAlias()).join(', ')}]`;
  }
}

export function tuple<T extends unknown[] = unknown[]>(
  contents: InferTupleContents<T>,
) /* infer */ {
  return new TupleBuilder<T>(contents);
}
