/* eslint-disable no-use-before-define */

export type UnknownFunction = (...args: unknown[]) => unknown;

export type UnknownObject = Record<string, unknown>;

export type MaybeDate = string | number | Date;

export type Constructor<T> = (new (...args: unknown[]) => T) | (Function & { prototype: T });

export type InferNullable<P, N> = P extends null ? N | null : N;

// CRITERIA

export type CriteriaValidator<T> = (
  value: T,
  path: string,
  currentObject: UnknownObject,
  rootObject: UnknownObject,
) => unknown;

export interface Criteria<T> {
  skipIfNull?: boolean;
  skipIfOptional?: boolean;
  validate: CriteriaValidator<T>;
}

export type CriteriaFactory<T> = (state: SchemaState<T>, ...args: any[]) => void | Criteria<T>;

export type CustomCallback<T> = (
  value: T,
  currentObject: UnknownObject,
  rootObject: UnknownObject,
) => void;

export interface CommonCriterias<S> {
  and: (...keys: string[]) => S;
  custom: (callback: CustomCallback<InferSchemaType<S>>) => S;
  deprecate: (message: string) => S;
  notRequired: () => S;
  only: () => S;
  or: (...keys: string[]) => S;
  required: () => S;
  xor: (...keys: string[]) => S;
  // Define in schemas directly
  // never: () => S;
  // notNullable: () => S;
  // nullable: () => S;
}

export interface ArrayCriterias<S> {
  notEmpty: () => S;
  sizeOf: (size: number) => S;
  // Define in schema directly
  // of: <V>(schema: Schema<V>) => S;
}

export interface BooleanCriterias<S> {
  onlyFalse: () => S;
  onlyTrue: () => S;
}

export interface DateCriterias<S> {
  after: (date: MaybeDate) => S;
  before: (date: MaybeDate) => S;
  between: (start: MaybeDate, end: MaybeDate, inclusive?: boolean) => S;
}

export interface NumberCriterias<S> {
  between: (min: number, max: number, inclusive?: boolean) => S;
  float: () => S;
  gt: (min: number, inclusive?: boolean) => S;
  gte: (min: number) => S;
  int: () => S;
  lt: (max: number, inclusive?: boolean) => S;
  lte: (max: number) => S;
  negative: () => S;
  positive: () => S;
  // Define in schema directly
  // oneOf: <I extends number>(list: I[]) => S;
}

export interface ObjectCriterias<S> {
  notEmpty: () => S;
  sizeOf: (size: number) => S;
  // Define in schema directly
  // of: <V>(schema: Schema<V>) => S;
}

export interface ShapeCriterias<S> {
  exact: () => S;
}

export interface StringCriterias<S> {
  camelCase: () => S;
  contains: (token: string, index?: number) => S;
  kebabCase: () => S;
  lowerCase: () => S;
  match: (pattern: RegExp, message?: string) => S;
  notEmpty: () => S;
  pascalCase: () => S;
  sizeOf: (size: number) => S;
  snakeCase: () => S;
  upperCase: () => S;
  // Define in schema directly
  // oneOf: <I extends string>(list: I[]) => S;
}

// SCHEMAS

export interface Schema<O, I = O> {
  type: () => string;
  validate: (
    value: I,
    path?: string,
    currentObject?: UnknownObject,
    rootObject?: UnknownObject,
  ) => O;
}

export interface SchemaState<T> {
  defaultValue: T | undefined;
  metadata: UnknownObject;
  never: boolean;
  nullable: boolean;
  required: boolean;
  type: string;
}

export interface SchemaOptions<T> {
  cast?: (value: unknown) => T;
  criteria: Record<string, CriteriaFactory<T>>;
  defaultValue?: T;
  type: string;
  validateType: CriteriaValidator<T>;
}

export type InferSchemaType<T> = T extends Schema<infer U> ? U : never;

export type Blueprint<T extends object> = { [K in keyof T]-?: Schema<T[K]> };

export type Predicate<T> = (value: T | null | undefined) => boolean;
