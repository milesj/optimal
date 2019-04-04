/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import optimal from './optimal';
import Builder, { bool, custom, func } from './Builder';
import ArrayBuilder, { array } from './ArrayBuilder';
import InstanceBuilder, { builder, instance, date, regex } from './InstanceBuilder';
import NumberBuilder, { number } from './NumberBuilder';
import ObjectBuilder, { object, blueprint } from './ObjectBuilder';
import ShapeBuilder, { shape } from './ShapeBuilder';
import StringBuilder, { string } from './StringBuilder';
import UnionBuilder, { union } from './UnionBuilder';

export const predicates = {
  array,
  blueprint,
  bool,
  builder,
  custom,
  date,
  func,
  instance,
  number,
  object,
  regex,
  shape,
  string,
  union,
};

export {
  array,
  blueprint,
  bool,
  builder,
  custom,
  date,
  func,
  instance,
  number,
  object,
  regex,
  shape,
  string,
  union,
};

export {
  Builder,
  ArrayBuilder,
  InstanceBuilder,
  NumberBuilder,
  ObjectBuilder,
  ShapeBuilder,
  StringBuilder,
  UnionBuilder,
};

export type Predicates = typeof predicates;

export * from './types';

export default optimal;
