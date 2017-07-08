declare module 'optimal' {
  declare export type SupportedType =
    'array' | 'boolean' | 'function' | 'instance' | 'number' |
    'object' | 'shape' | 'string' | 'union' | 'custom';

  declare export type Checker = (path: string, value: *, ...args: *[]) => void;

  declare export type Blueprint = { [key: string]: Builder<*> | Blueprint };

  declare export type Factory = (factories: {
    array: (builder: Builder<*>, defaultValue: ?*[]) => Builder<?*[]>,
    bool: (defaultValue: boolean) => Builder<boolean>,
    custom: (checker: Checker, defaultValue: *) => Builder<?*>,
    date: () => Builder<Class<Date>>,
    func: (defaultValue: ?Function) => Builder<?Function>,
    instance: (refClass: *) => Builder<?*>,
    number: (defaultValue: number) => Builder<number>,
    object: (builder?: Builder<*>, defaultValue: ?{ [key: string]: * }) => Builder<?Object>,
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
    currentOptions: Object;
    defaultValue: T;
    errorMessage: string;
    isNullable: boolean;
    isRequired: boolean;
    type: SupportedType;

    constructor(type: SupportedType, defaultValue: T): void;
    addCheck(func: Checker, ...args: *[]): this;
    and(...keys: string[]): this;
    invariant(condition: boolean, message: string, path: string): void;
    message(message: string): this;
    nullable(state: boolean): this;
    only(): this;
    or(...keys: string[]): this;
    required(state: boolean): this;
    runChecks(path: string, value: *, options: Object, config: Config): *;
  }

  declare export default class Options {
    constructor(baseOptions: Object, factory: Factory, config: Config): void;
  }
}
