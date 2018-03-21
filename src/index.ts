/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Builder, { bool, custom, func } from './Builder';
import CollectionBuilder, { array, object } from './CollectionBuilder';
import InstanceBuilder, { instance, date, regex } from './InstanceBuilder';
import NumberBuilder, { number } from './NumberBuilder';
import ShapeBuilder, { shape } from './ShapeBuilder';
import StringBuilder, { string } from './StringBuilder';
import UnionBuilder, { union } from './UnionBuilder';
import parseOptions from './Options';
import { Blueprint, Checker, Config, CustomCallback, Options, SupportedType } from './types';

export { array, bool, custom, date, func, instance, number, object, regex, shape, string, union };

export { Builder, CollectionBuilder, InstanceBuilder, NumberBuilder, ShapeBuilder, StringBuilder, UnionBuilder };

export { Blueprint, Checker, Config, CustomCallback, Options, SupportedType };

export default parseOptions;
