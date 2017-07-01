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
import type RegexBuilder from './RegexBuilder';
import type StringBuilder from './StringBuilder';

export type SupportedType =
  'array' | 'object' | 'function' | 'instance' |
  'boolean' | 'string' | 'number' | 'regex';

export type Checker = (path: string, value: *, ...args: *[]) => void;

export type Blueprint = { [key: string]: Builder<*> | Blueprint };

export type FactoryMap = {
  arrayOf: (builder: Builder<*>) => ArrayBuilder<*>,
  bool: (value: boolean) => BoolBuilder,
  func: (value: ?Function) => FuncBuilder,
  instanceOf: (refClass: Class<*>) => InstanceBuilder<*>,
  number: (value: number) => NumberBuilder,
  objectOf: (builder: Builder<*>) => ObjectBuilder<*>,
  regex: (value: ?RegExp) => RegexBuilder,
  string: (value: string) => StringBuilder,
};

export type Factory = (factories: FactoryMap) => Blueprint;
