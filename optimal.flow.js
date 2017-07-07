declare module 'optimal' {
  declare export type SupportedType =
    'array' | 'boolean' | 'function' | 'instance' | 'number' |
    'object' | 'shape' | 'string' | 'union' | 'custom';

  declare export type Checker = (path: string, value: *, ...args: *[]) => void;

  declare export type Blueprint = { [key: string]: Builder<*> | Blueprint };

  declare export type Factory = (factories: {
    arrayOf: (builder: Builder<*>, defaultValue: ?*[]) => Builder<?*[]>,
    bool: (defaultValue: boolean) => Builder<boolean>,
    custom: (checker: Checker, defaultValue: *) => Builder<?*>,
    date: () => Builder<Class<Date>>,
    func: (defaultValue: ?Function) => Builder<?Function>,
    instanceOf: (refClass: *) => Builder<?*>,
    number: (defaultValue: number) => Builder<number>,
    objectOf: (builder: Builder<*>, defaultValue: ?{ [key: string]: * }) => Builder<?Object>,
    regex: () => Builder<Class<RegExp>>,
    shape: (builders: { [key: string]: Builder<*> }, defaultValue: ?{ [key: string]: * }) => Builder<?Object>,
    string: (defaultValue: string) => Builder<string>,
    union: (builders: Builder<*>[], defaultValue: *) => Builder<*>,
  }) => Blueprint;

  declare export type Config = {
    name?: string,
    unknown?: boolean,
  };

  declare export class Builder<T> {
    checks: {
      args: *[],
      func: Checker,
    }[];
    currentConfig: Config;
    defaultValue: T;
    errorMessage: string;
    isNullable: boolean;
    isRequired: boolean;
    type: SupportedType;

    constructor(type: SupportedType, defaultValue: T): void;
    addCheck(func: Checker, ...args: *[]): this;
    invariant(condition: boolean, message: string, path: string): void;
    message(message: string): this;
    nullable(state: boolean): this;
    only(): this;
    required(state: boolean): this;
    runChecks(path: string, initialValue: *, config: Config): *;
  }

  declare export default class Options {
    constructor(baseOptions: Object, factory: Factory, config: Config): void;
  }
}
