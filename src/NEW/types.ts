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

export type Criteria<T> = (state: SchemaState<T>, ...args: any[]) => void | CriteriaValidator<T>;

export type CustomCallback<T> = (
  value: T,
  currentObject: UnknownObject,
  rootObject: UnknownObject,
) => void;

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

export type SchemaFactory<T, P> = (defaultValue?: T) => P;

export interface SchemaState<T> {
  defaultValue: T | undefined;
  deprecatedMessage: string;
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
