/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable flowtype/no-weak-types */

import type Builder from './Builder';
import type ArrayBuilder from './ArrayBuilder';
import type BoolBuilder from './BoolBuilder';
import type FuncBuilder from './FuncBuilder';
import type InstanceBuilder from './InstanceBuilder';
import type NumberBuilder from './NumberBuilder';
import type ObjectBuilder from './ObjectBuilder';
import type ShapeBuilder from './ShapeBuilder';
import type StringBuilder from './StringBuilder';
import type UnionBuilder from './UnionBuilder';

export type SupportedType =
  'array' | 'boolean' | 'function' | 'instance' | 'number' |
  'object' | 'shape' | 'string' | 'union';

export type Checker = (path: string, value: *, ...args: *[]) => void;

export type Blueprint = { [key: string]: Builder<*> | Blueprint };

export type FactoryMap = {
  arrayOf: (builder: Builder<*>) => ArrayBuilder<*>,
  bool: (value: boolean) => BoolBuilder,
  date: (value: ?Date) => InstanceBuilder<Class<Date>>,
  func: (value: ?Function) => FuncBuilder,
  instanceOf: (refClass: *) => InstanceBuilder<*>,
  number: (value: number) => NumberBuilder,
  objectOf: (builder: Builder<*>) => ObjectBuilder<*>,
  regex: (value: ?RegExp) => InstanceBuilder<Class<RegExp>>,
  shape: (builders: { [key: string]: Builder<*> }) => ShapeBuilder,
  string: (value: string) => StringBuilder,
  union: (builders: Builder<*>[]) => UnionBuilder,
};

export type Factory = (factories: FactoryMap) => Blueprint;
