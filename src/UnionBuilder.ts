import Builder from './Builder';
import typeOf from './typeOf';

export default class UnionBuilder<T = unknown> extends Builder<T> {
  builders: Builder<unknown>[] = [];

  constructor(builders: Builder<unknown>[], defaultValue: any) {
    super('union', defaultValue);

    if (__DEV__) {
      this.invariant(
        Array.isArray(builders) &&
          builders.length > 0 &&
          builders.every(builder => builder instanceof Builder),
        'A non-empty array of blueprints are required for a union.',
      );

      this.builders = builders;
      this.addCheck(this.checkUnions, builders);
    }
  }

  checkUnions(path: string, value: any, builders: Builder<unknown>[]) {
    if (__DEV__) {
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
            // eslint-disable-next-line no-param-reassign
            builder.noPrefix = true;
            builder.runChecks(path, value, this.currentStruct, {
              ...this.options,
              unknown: true,
            });

            // We have a valid result, so remove errors
            errors.clear();

            return true;
          }
        } catch (error) {
          errors.add(` - ${error.message}`);
        }

        return false;
      });

      let message = `Type must be one of: ${keys}.`;

      if (errors.size > 0) {
        message += ` Received ${type} with the following invalidations:\n`;
        message += Array.from(errors).join('\n');
      }

      this.invariant(passed && errors.size === 0, message, path);
    }
  }

  /**
   * Return the type name using generics syntax.
   */
  typeAlias(): string {
    return this.builders.map(builder => builder.typeAlias()).join(' | ');
  }
}

export function union<T = unknown>(builders: Builder<unknown>[], defaultValue: any) /* infer */ {
  return new UnionBuilder<T>(builders, defaultValue);
}
