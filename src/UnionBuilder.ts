import Builder from './Builder';
import typeOf from './typeOf';
import { DefaultValue } from './types';

export default class UnionBuilder<T = unknown> extends Builder<T> {
  protected builders: Builder<unknown>[] = [];

  constructor(builders: Builder<unknown>[], defaultValue: DefaultValue<T>) {
    super('union', defaultValue);

    if (__DEV__) {
      this.invariant(
        Array.isArray(builders) &&
          builders.length > 0 &&
          builders.every(builder => builder instanceof Builder),
        'A non-empty array of blueprints are required for a union.',
      );

      this.builders = builders;
      this.addCheck(this.checkUnions);
    }
  }

  /**
   * Return the type name using pipe syntax.
   */
  typeAlias(): string {
    return this.builders.map(builder => builder.typeAlias()).join(' | ');
  }

  protected checkUnions(path: string, value: unknown) {
    let nextValue = value;

    if (__DEV__) {
      const { builders } = this;
      const keys = builders.map(builder => builder.typeAlias()).join(', ');
      const type = typeOf(value);
      const errors = new Set();
      const passed = builders.some(builder => {
        if (builder.type === 'union') {
          this.invariant(false, 'Nested unions are not supported.', path);
        }

        try {
          if (
            type === builder.type ||
            (type === 'object' && builder.type === 'shape') ||
            builder.type === 'custom'
          ) {
            // @ts-ignore
            builder.noErrorPrefix = true; // eslint-disable-line no-param-reassign
            nextValue = builder.runChecks(path, value, this.currentStruct, this.options);

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

        errors.forEach(error => {
          message += error;
        });
      }

      this.invariant(passed, message.trim(), path);
    }

    return nextValue;
  }
}

export function union<T = unknown>(
  builders: Builder<unknown>[],
  defaultValue: DefaultValue<T>,
) /* infer */ {
  return new UnionBuilder<T>(builders, defaultValue);
}
