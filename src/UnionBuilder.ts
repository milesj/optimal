import Builder from './Builder';
import typeOf from './typeOf';

export default class UnionBuilder<T = unknown> extends Builder<T> {
  builders: Builder<unknown>[] = [];

  constructor(builders: Builder<unknown>[], defaultValue: T) {
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

  checkUnions(path: string, value: unknown, builders: Builder<unknown>[]) {
    let nextValue = value;

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
            builder.noErrorPrefix = true;
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

  /**
   * Return the type name using pipe syntax.
   */
  typeAlias(): string {
    return this.builders.map(builder => builder.typeAlias()).join(' | ');
  }
}

export function union<T = unknown>(builders: Builder<unknown>[], defaultValue: T) /* infer */ {
  return new UnionBuilder<T>(builders, defaultValue);
}
