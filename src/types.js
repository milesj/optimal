/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable flowtype/no-weak-types, max-len */

import type Builder from './Builder';
import type CollectionBuilder from './CollectionBuilder';
import type InstanceBuilder from './InstanceBuilder';
import type NumberBuilder from './NumberBuilder';
import type ShapeBuilder from './ShapeBuilder';
import type StringBuilder from './StringBuilder';
import type UnionBuilder from './UnionBuilder';

// Note: Keep in sync with flow definition!

export type SupportedType =
  'array' | 'boolean' | 'function' | 'instance' | 'number' |
  'object' | 'shape' | 'string' | 'union' | 'custom';

export type Checker = (path: string, value: *, ...args: *[]) => void;

export type CustomCallback = (value: *, options: Object) => void;

export type Blueprint = { [key: string]: Builder<*> | Blueprint };

export type Builders = {
  array: (builder: Builder<*>, defaultValue?: ?*[]) => CollectionBuilder<*, *[]>,
  bool: (defaultValue?: ?boolean) => Builder<?boolean>,
  custom: (callback: CustomCallback, defaultValue?: *) => Builder<*>,
  date: () => InstanceBuilder<Class<Date>>,
  func: (defaultValue?: ?Function) => Builder<?Function>,
  instance: (refClass: *) => InstanceBuilder<*>,
  number: (defaultValue?: ?number) => NumberBuilder,
  object: (builder?: Builder<*>, defaultValue?: ?{ [key: string]: * }) => CollectionBuilder<*, { [key: string]: * }>,
  regex: () => InstanceBuilder<Class<RegExp>>,
  shape: (builders: { [key: string]: Builder<*> }, defaultValue?: ?{ [key: string]: * }) => ShapeBuilder,
  string: (defaultValue?: ?string) => StringBuilder,
  union: (builders: Builder<*>[], defaultValue?: *) => UnionBuilder,
};

export type Factory = (builders: Builders) => Blueprint;

export type Config = {
  name?: string,
  unknown?: boolean,
};
