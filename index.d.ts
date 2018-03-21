declare module 'optimal/lib/isObject' {
  export default function isObject(value: any): boolean;

}
declare module 'optimal/lib/types' {
  import Builder from 'optimal/lib/Builder';
  export type SupportedType = 'array' | 'boolean' | 'function' | 'instance' | 'number' | 'object' | 'shape' | 'string' | 'union' | 'custom';
  export type Checker = (path: string, value: any, ...args: any[]) => void;
  export type CustomCallback = (value: any, options: object) => void;
  export interface Blueprint {
      [field: string]: Builder<any> | Blueprint;
  }
  export interface Config {
      name?: string;
      unknown?: boolean;
  }
  export interface Options {
      [key: string]: any;
  }

}
declare module 'optimal/lib/Builder' {
  import { SupportedType, Checker, Config, CustomCallback, Options } from 'optimal/lib/types';
  export interface Check {
      args: any[];
      callback: Checker;
  }
  export default class Builder<T> {
      checks: Check[];
      currentConfig: Config;
      currentOptions: Options;
      defaultValue: T;
      deprecatedMessage: string;
      errorMessage: string;
      isNullable: boolean;
      isRequired: boolean;
      type: SupportedType;
      constructor(type: SupportedType, defaultValue: T);
      addCheck(checker: Checker, ...args: any[]): this;
      and(...keys: string[]): this;
      checkAnd(path: string, value: any, otherKeys: string[]): void;
      checkType(path: string, value: any): void;
      custom(callback: CustomCallback): this;
      checkCustom(path: string, value: any, callback: CustomCallback): void;
      deprecate(message: string): this;
      invariant(condition: boolean, message: string, path?: string): void;
      key(path: string): string;
      message(message: string): this;
      nullable(state?: boolean): this;
      only(): this;
      checkOnly(path: string, value: any): void;
      or(...keys: string[]): this;
      checkOr(path: string, value: any, otherKeys: string[]): void;
      required(state?: boolean): this;
      runChecks(path: string, initialValue: any, options: Object, config?: Config): any;
      typeAlias(): string;
      xor(...keys: string[]): this;
      checkXor(path: string, value: any, otherKeys: string[]): void;
  }
  export function bool(defaultValue?: boolean | null): Builder<boolean | null>;
  export function custom<T>(callback: CustomCallback, defaultValue?: T | null): Builder<T | null>;
  export function func(defaultValue?: Function | null): Builder<Function | null>;

}
declare module 'optimal/lib/CollectionBuilder' {
  import Builder from 'optimal/lib/Builder';
  export default class CollectionBuilder<T, TDefault> extends Builder<TDefault | null> {
      contents: Builder<T> | null;
      constructor(type: 'array' | 'object', contents?: Builder<T> | null, defaultValue?: TDefault | null);
      checkContents(path: string, value: any, contents: Builder<T>): void;
      notEmpty(): this;
      checkNotEmpty(path: string, value: any): void;
      typeAlias(): string;
  }
  export function array<T>(contents?: Builder<T> | null, defaultValue?: T[] | null): CollectionBuilder<T, T[]>;
  export function object<T>(contents?: Builder<T> | null, defaultValue?: {
      [key: string]: T;
  } | null): CollectionBuilder<T, {
      [key: string]: T;
  }>;

}
declare module 'optimal/lib/InstanceBuilder' {
  import Builder from 'optimal/lib/Builder';
  export default class InstanceBuilder<T> extends Builder<T | null> {
      refClass: T | null;
      constructor(refClass?: T | null);
      checkInstance(path: string, value: any, refClass: T | null): void;
      typeAlias(): string;
  }
  export function instance<T>(refClass?: T | null): InstanceBuilder<T>;
  export function regex(): InstanceBuilder<Function>;
  export function date(): InstanceBuilder<Function>;

}
declare module 'optimal/lib/NumberBuilder' {
  import Builder from 'optimal/lib/Builder';
  export default class NumberBuilder extends Builder<number | null> {
      constructor(defaultValue?: number | null);
      between(min: number, max: number, inclusive?: boolean): this;
      checkBetween(path: string, value: any, min: number, max: number, inclusive?: boolean): void;
      gt(min: number, inclusive?: boolean): this;
      gte(min: number): this;
      checkGreaterThan(path: string, value: any, min: number, inclusive?: boolean): void;
      lt(max: number, inclusive?: boolean): this;
      lte(max: number): this;
      checkLessThan(path: string, value: any, max: number, inclusive?: boolean): void;
      oneOf(list: number[]): this;
      checkOneOf(path: string, value: any, list: number[]): void;
  }
  export function number(defaultValue?: number | null): NumberBuilder;

}
declare module 'optimal/lib/ShapeBuilder' {
  import Builder from 'optimal/lib/Builder';
  export interface ShapeBlueprint {
      [key: string]: Builder<any>;
  }
  export interface Shape {
      [key: string]: any;
  }
  export default class ShapeBuilder extends Builder<Shape | null> {
      constructor(contents: ShapeBlueprint, defaultValue?: Shape | null);
      checkContents(path: string, object: any, contents: ShapeBlueprint): void;
  }
  export function shape(contents: ShapeBlueprint, defaultValue?: Shape | null): ShapeBuilder;

}
declare module 'optimal/lib/StringBuilder' {
  import Builder from 'optimal/lib/Builder';
  export default class StringBuilder extends Builder<string | null> {
      allowEmpty: boolean;
      constructor(defaultValue?: string | null);
      contains(token: string, index?: number): this;
      checkContains(path: string, value: any, token: string, index?: number): void;
      match(pattern: RegExp): this;
      checkMatch(path: string, value: any, pattern: RegExp): void;
      empty(): this;
      checkNotEmpty(path: string, value: any): void;
      oneOf(list: string[]): this;
      checkOneOf(path: string, value: any, list: string[]): void;
  }
  export function string(defaultValue?: string | null): StringBuilder;

}
declare module 'optimal/lib/typeOf' {
  import { SupportedType } from 'optimal/lib/types';
  export default function typeOf(value: any): SupportedType;

}
declare module 'optimal/lib/UnionBuilder' {
  import Builder from 'optimal/lib/Builder';
  export default class UnionBuilder extends Builder<any> {
      builders: Builder<any>[];
      constructor(builders: Builder<any>[], defaultValue?: any | null);
      checkUnions(path: string, value: any, builders: Builder<any>[]): void;
      typeAlias(): string;
  }
  export function union(builders: Builder<any>[], defaultValue?: any | null): UnionBuilder;

}
declare module 'optimal/lib/Options' {
  import { Blueprint, Config, Options } from 'optimal/lib/types';
  export default function parseOptions(options: Options, blueprint: Blueprint, config?: Config): Options;

}
declare module 'optimal/lib/index' {
  import { bool, custom, func } from 'optimal/lib/Builder';
  import { array, object } from 'optimal/lib/CollectionBuilder';
  import { instance, date, regex } from 'optimal/lib/InstanceBuilder';
  import { number } from 'optimal/lib/NumberBuilder';
  import { shape } from 'optimal/lib/ShapeBuilder';
  import { string } from 'optimal/lib/StringBuilder';
  import { union } from 'optimal/lib/UnionBuilder';
  export { array, bool, custom, date, func, instance, number, object, regex, shape, string, union };
  export { default } from 'optimal/lib/Options';

}
