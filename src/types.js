/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable flowtype/no-weak-types, max-len */

import type Builder from './Builder';
import type ArrayBuilder from './ArrayBuilder';
import type BoolBuilder from './BoolBuilder';
import type CustomBuilder from './CustomBuilder';
import type FuncBuilder from './FuncBuilder';
import type InstanceBuilder from './InstanceBuilder';
import type NumberBuilder from './NumberBuilder';
import type ObjectBuilder from './ObjectBuilder';
import type ShapeBuilder from './ShapeBuilder';
import type StringBuilder from './StringBuilder';
import type UnionBuilder from './UnionBuilder';

// Note: Keep in sync with flow definition!

export type SupportedType =
  'array' | 'boolean' | 'function' | 'instance' | 'number' |
  'object' | 'shape' | 'string' | 'union' | 'custom';

export type Checker = (path: string, value: *, ...args: *[]) => void;

export type Blueprint = { [key: string]: Builder<*> | Blueprint };

export type FactoryMap = {
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

export type Factory = (factories: FactoryMap) => Blueprint;

export type Config = {
  name?: string,
  unknown?: boolean,
};
