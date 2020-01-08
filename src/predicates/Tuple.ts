import Predicate from '../Predicate';

export type InferTupleContents<T> = T extends [infer A, infer B, infer C, infer D, infer E]
  ? [Predicate<A>, Predicate<B>, Predicate<C>, Predicate<D>, Predicate<E>]
  : T extends [infer A, infer B, infer C, infer D]
  ? [Predicate<A>, Predicate<B>, Predicate<C>, Predicate<D>]
  : T extends [infer A, infer B, infer C]
  ? [Predicate<A>, Predicate<B>, Predicate<C>]
  : T extends [infer A, infer B]
  ? [Predicate<A>, Predicate<B>]
  : T extends [infer A]
  ? [Predicate<A>]
  : never;

export default class TuplePredicate<T extends unknown[] = unknown[]> extends Predicate<T> {
  protected contents: InferTupleContents<T>;

  constructor(contents: InferTupleContents<T>) {
    super('tuple', ([] as unknown) as T);

    if (__DEV__) {
      this.invariant(
        Array.isArray(contents) &&
          contents.length > 0 &&
          contents.every(content => content instanceof Predicate),
        'A non-empty array of blueprints are required for a tuple.',
      );
    }

    this.contents = contents;
  }

  default(): T {
    return this.contents.map(content => content.default()) as T;
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
  return new TuplePredicate<T>(contents);
}
