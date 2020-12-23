export function invariant(condition: boolean, message: string, path: string = '') {
  if (__DEV__) {
    if (condition) {
      return;
    }

    const prefix = `Invalid field "${path}"`;
    const noErrorPrefix = false; // TODO

    const error =
      prefix && !noErrorPrefix ? new Error(`${prefix}. ${message}`) : new Error(message);

    throw error;
  }
}

export function isObject(value: unknown): value is object {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function pathKey(path: string): string {
  const index = path.lastIndexOf('.');

  return index > 0 ? path.slice(index + 1) : path;
}
