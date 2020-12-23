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

// CHECKERS

export type CheckerCallback<T> = (
  value: T,
  path: string,
  currentObject: UnknownObject,
  rootObject: UnknownObject,
) => unknown;

export type Checker<T> = (state: PredicateState<T>, ...args: any[]) => void | CheckerCallback<T>;

export type CustomCallback<T> = (
  value: T,
  currentObject: UnknownObject,
  rootObject: UnknownObject,
) => void;

// PREDICATES

export interface Predicate<T> {
  typeAlias: string;
  validate: (
    value: T,
    path?: string,
    currentObject?: UnknownObject,
    rootObject?: UnknownObject,
  ) => T;
}

export type PredicateFactory<T, P> = (defaultValue?: T) => P;

export interface PredicateState<T> {
  defaultValue: T | undefined;
  deprecatedMessage: string;
  metadata: UnknownObject;
  never: boolean;
  nullable: boolean;
  required: boolean;
  type: SupportedType;
}

export interface PredicateOptions<T> {
  castValue?: (value: unknown) => T;
  initialValue: T;
  onCreate?: Checker<T>;
}
