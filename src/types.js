/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type Builder from './Builder';
import type BoolBuilder from './BoolBuilder';

export type SupportedType = 'boolean' | 'string' | 'number';

export type Checker = (path: string, value: *) => void;

export type Blueprint = { [key: string]: Builder<*> | Blueprint };

export type FactoryMap = {
  bool: (value: boolean) => BoolBuilder,
};

export type Factory = (factories: FactoryMap) => Blueprint;
