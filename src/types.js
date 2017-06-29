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
import type NumberBuilder from './NumberBuilder';
import type StringBuilder from './StringBuilder';

export type SupportedType = 'array' | 'object' | 'boolean' | 'string' | 'number' | 'function';

export type Checker = (path: string, value: *, ...args: *[]) => void;

export type Blueprint = { [key: string]: Builder<*> | Blueprint };

export type FactoryMap = {
  arrayOf: (builder: Builder<*>) => ArrayBuilder<*>,
  bool: (value: boolean) => BoolBuilder,
  func: (value: ?Function) => FuncBuilder,
  number: (value: number) => NumberBuilder,
  string: (value: string) => StringBuilder,
};

export type Factory = (factories: FactoryMap) => Blueprint;
