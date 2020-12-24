/* eslint-disable no-use-before-define */
// Any is required here since we're literally checking any type of value.
/* eslint-disable @typescript-eslint/no-explicit-any */

export type SupportedType =
  | 'array'
  | 'boolean'
  | 'custom'
  | 'function'
  | 'instance'
  | 'number'
  | 'object'
  | 'shape'
  | 'string'
  | 'tuple'
  | 'union'
  | 'unknown';

export type UnknownObject = Record<string, unknown>;

export type Constructor<T> = (new (...args: unknown[]) => T) | (Function & { prototype: T });

// CRITERIA

export type CriteriaValidator<T> = (
  value: T,
  path: string,
  currentObject: UnknownObject,
  rootObject: UnknownObject,
) => unknown;

export interface CriteriaState<T> {
  skipIfNull?: boolean;
  skipIfOptional?: boolean;
  validate: CriteriaValidator<T>;
}

export type Criteria<T> = (state: SchemaState<T>, ...args: any[]) => void | CriteriaState<T>;

export type CustomCallback<T> = (
  value: T,
  currentObject: UnknownObject,
  rootObject: UnknownObject,
) => void;

export interface CommonCriteria<T, S, NullS, NonNullS> {
  and: (...keys: string[]) => S;
  custom: (callback: CustomCallback<T>) => S;
  deprecate: (message: string) => S;
  never: () => S;
  notNullable: () => NonNullS;
  notRequired: () => S;
  nullable: () => NullS;
  only: () => S;
  or: (...keys: string[]) => S;
  required: () => S;
  xor: (...keys: string[]) => S;
}

export interface ArrayCriteria<S> {
  notEmpty: () => S;
  sizeOf: (size: number) => S;
}

export interface NumberCriteria<S> {
  between: (min: number, max: number, inclusive?: boolean) => S;
  float: () => S;
  gt: (min: number, inclusive?: boolean) => S;
  gte: (min: number) => S;
  int: () => S;
  lt: (max: number, inclusive?: boolean) => S;
  lte: (max: number) => S;
  negative: () => S;
  oneOf: <I extends number>(list: I[]) => S;
  positive: () => S;
}

export interface StringCriteria<S> {
  camelCase: () => S;
  contains: (token: string, index?: number) => S;
  kebabCase: () => S;
  lowerCase: () => S;
  match: (pattern: RegExp, message?: string) => S;
  notEmpty: () => S;
  oneOf: <I extends string>(list: I[]) => S;
  pascalCase: () => S;
  sizeOf: (size: number) => S;
  snakeCase: () => S;
  upperCase: () => S;
}

// SCHEMAS

export interface Schema<T> {
  typeAlias: string;
  validate: (
    value: T,
    path?: string,
    currentObject?: UnknownObject,
    rootObject?: UnknownObject,
  ) => T;
}

export type SchemaFactory<T, S> = (defaultValue?: T) => S;

export interface SchemaState<T> {
  defaultValue: T | undefined;
  metadata: UnknownObject;
  never: boolean;
  nullable: boolean;
  required: boolean;
  type: SupportedType;
}

export interface SchemaOptions<T> {
  cast?: (value: unknown) => T;
  initialValue: T;
  onCreate?: Criteria<T>;
}
