/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable flowtype/no-weak-types */

import type Builder from './Builder';
import type BoolBuilder from './BoolBuilder';
import type FuncBuilder from './FuncBuilder';
import type StringBuilder from './StringBuilder';

export type SupportedType = 'boolean' | 'string' | 'number' | 'function';

export type Checker = (path: string, value: *, ...args: *[]) => void;

export type Blueprint = { [key: string]: Builder<*> | Blueprint };

export type FactoryMap = {
  bool: (value: boolean) => BoolBuilder,
  func: (value: ?Function) => FuncBuilder,
  string: (value: string) => StringBuilder,
};

export type Factory = (factories: FactoryMap) => Blueprint;
