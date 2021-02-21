import Predicate from '../Predicate';
import typeOf from '../typeOf';
import { DefaultValue } from '../types';

export default class UnionPredicate<T = unknown> extends Predicate<T> {
  protected contents: Predicate<unknown>[] = [];

  constructor(contents: Predicate<unknown>[], defaultValue: DefaultValue<T>) {
    super('union', defaultValue);

    if (__DEV__) {
      this.invariant(
        Array.isArray(contents) &&
          contents.length > 0 &&
          contents.every((content) => content instanceof Predicate),
        'A non-empty array of blueprints are required for a union.',
      );

      this.addCheck(this.checkUnions);
    }

    this.contents = contents;
  }

  /**
   * Return the type name using pipe syntax.
   */
  typeAlias(): string {
    return this.contents.map((content) => content.typeAlias()).join(' | ');
  }

  protected checkUnions(path: string, value: unknown) {
    let nextValue = value;

    if (__DEV__) {
      const { contents } = this;
      const keys = contents.map((content) => content.typeAlias()).join(', ');
      const type = typeOf(value);
      const errors = new Set();
      const passed = contents.some((content) => {
        if (content.type === 'union') {
          this.invariant(false, 'Nested unions are not supported.', path);
        }

        try {
          if (
            type === content.type ||
            (type === 'object' && content.type === 'shape') ||
            (type === 'array' && content.type === 'tuple') ||
            content.type === 'custom'
          ) {
            // @ts-expect-error
            content.noErrorPrefix = true;
            nextValue = content.run(value, path, this.schema!);

            return true;
          }
        } catch (error) {
          errors.add(` - ${error.message}\n`);
        }

        return false;
      });

      let message = `Type must be one of: ${keys}.`;

      if (!passed && errors.size > 0) {
        message += ` Received ${type} with the following invalidations:\n`;

        errors.forEach((error) => {
          message += error;
        });
      }

      this.invariant(passed, message.trim(), path);
    }

    return nextValue;
  }
}

export function union<T = unknown>(
  contents: Predicate<unknown>[],
  defaultValue: DefaultValue<T>,
) /* infer */ {
  return new UnionPredicate<T>(contents, defaultValue);
}
