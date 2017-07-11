declare module 'optimal' {
  declare export type SupportedType =
    'array' | 'boolean' | 'function' | 'instance' | 'number' |
    'object' | 'shape' | 'string' | 'union' | 'custom';

  declare export type Checker = (path: string, value: *, ...args: *[]) => void;

  declare export type CustomChecker = (
    path: string,
    value: *,
    options: Object,
    invariant: (condition: boolean, message: string, path?: string) => void,
  ) => void;

  declare export type Blueprint = { [key: string]: Builder<*> | Blueprint };

  declare export type Builders = {
    array: (builder: Builder<*>, defaultValue?: ?*[]) => ArrayBuilder<*>,
    bool: (defaultValue?: ?boolean) => BoolBuilder,
    custom: (checker: Checker, defaultValue?: *) => CustomBuilder,
    date: () => InstanceBuilder<Class<Date>>,
    func: (defaultValue?: ?Function) => FuncBuilder,
    instance: (refClass: *) => InstanceBuilder<*>,
    number: (defaultValue?: ?number) => NumberBuilder,
    object: (builder?: Builder<*>, defaultValue?: ?{ [key: string]: * }) => ObjectBuilder<*>,
    regex: () => InstanceBuilder<Class<RegExp>>,
    shape: (builders: { [key: string]: Builder<*> }, defaultValue?: ?{ [key: string]: * }) => ShapeBuilder,
    string: (defaultValue?: ?string) => StringBuilder,
    union: (builders: Builder<*>[], defaultValue?: *) => UnionBuilder,
  };

  declare export type Factory = (builders: Builders) => Blueprint;

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
    deprecatedMessage: string;
    errorMessage: string;
    isNullable: boolean;
    isRequired: boolean;
    type: SupportedType;
    constructor(type: SupportedType, defaultValue: T): void;
    addCheck(func: Checker, ...args: *[]): this;
    and(...keys: string[]): this;
    deprecate(message: string): this;
    invariant(condition: boolean, message: string, path?: string): void;
    key(path: string): string;
    message(message: string): this;
    nullable(state?: boolean): this;
    only(): this;
    or(...keys: string[]): this;
    required(state?: boolean): this;
    runChecks(path: string, value: *, options: Object, config?: Config): *;
    xor(...keys: string[]): this;
  }

  declare export class ArrayBuilder<T> extends Builder<?T[]> {
    constructor(contents: Builder<T>, defaultValue?: ?T[]): void;
    notEmpty(): this;
  }

  declare export class BoolBuilder extends Builder<?boolean> {
    constructor(defaultValue?: ?boolean): void;
  }

  declare export class CustomBuilder extends Builder<*> {
    constructor(callback: CustomChecker, defaultValue?: *): void;
  }

  declare export class FuncBuilder extends Builder<?Function> {
    constructor(defaultValue?: ?Function): void;
  }

  declare export class InstanceBuilder<T> extends Builder<?T> {
    refClass: T;
    constructor(refClass: T): void;
  }

  declare export class NumberBuilder extends Builder<?number> {
    constructor(defaultValue?: ?number): void;
    between(min: number, max: number, inclusive?: boolean): this;
    gt(min: number, inclusive?: boolean): this;
    gte(min: number): this;
    lt(max: number, inclusive?: boolean): this;
    lte(max: number): this;
    oneOf(list: number[]): this;
  }

  declare export class ObjectBuilder<T> extends Builder<?{ [key: string]: T }> {
    constructor(contents?: Builder<T>, defaultValue?: ?{ [key: string]: T }): void;
    notEmpty(): this;
  }

  declare export class ShapeBuilder extends Builder<?{ [key: string]: * }> {
    constructor(contents: { [key: string]: Builder<*> }, defaultValue?: ?{ [key: string]: * }): void;
  }

  declare export class StringBuilder extends Builder<?string> {
    allowEmpty: boolean;
    constructor(defaultValue?: ?string): void;
    contains(token: string, index?: number): this;
    match(pattern: RegExp): this;
    empty(): this;
    oneOf(list: string[]): this;
  }

  declare export class UnionBuilder extends Builder<*> {
    constructor(builders: Builder<*>[], defaultValue?: *): void;
  }

  declare export default function Options(
    baseOptions: Object,
    factory: Factory,
    config?: Config,
  ): Object;
}
