import Builder from './Builder';

export default class CollectionBuilder<T> extends Builder<T> {
  sizeOf(length: number): this {
    if (__DEV__) {
      this.invariant(
        typeof length === 'number' && length > 0,
        'Size requires a non-zero positive number.',
      );

      this.addCheck((path, value) => {
        // Array
        if (Array.isArray(value)) {
          this.invariant(value.length === length, `Array length must be ${length}.`, path);

          // String
        } else if (typeof value === 'string') {
          this.invariant(value.length === length, `String length must be ${length}.`, path);

          // Object
        } else if (typeof value === 'object' && value) {
          this.invariant(
            Object.keys(value).length === length,
            `Object must have ${length} properties.`,
            path,
          );

          // Unknown
        } else {
          this.invariant(false, 'Unknown type for size of checks.', path);
        }
      });
    }

    return this;
  }
}
