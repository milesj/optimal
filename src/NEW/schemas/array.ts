import { commonCriteria, arrayCriteria } from '../criteria';
import createSchema from '../createSchema';
import { invariant, isSchema } from '../helpers';
import { CommonCriteria, Schema, SchemaState, ArrayCriteria, CriteriaState } from '../types';

function of<T>(state: SchemaState<T[]>, itemsSchema: Schema<T>): void | CriteriaState<T[]> {
  if (__DEV__) {
    if (!isSchema(itemsSchema)) {
      invariant(false, 'A schema blueprint is required for array contents.');
    }
  }

  return {
    skipIfNull: true,
    validate(value, path, currentObject, rootObject) {
      const nextValue = [...value];

      value.forEach((item, i) => {
        nextValue[i] = itemsSchema.validate(item, `${path}[${i}]`, currentObject, rootObject);
      });

      return nextValue;
    },
  };
}

export interface ArraySchema<T>
  extends Schema<T[]>,
    ArrayCriteria<ArraySchema<T>>,
    CommonCriteria<T[], ArraySchema<T>, ArraySchema<T | null>, ArraySchema<NonNullable<T>>> {
  // @internal
  of: (schema: Schema<T>) => ArraySchema<T>;
}

const schema = createSchema<unknown[], ArraySchema<unknown>>(
  'array',
  { ...commonCriteria, ...arrayCriteria, of },
  {
    cast(value) {
      if (value === undefined) {
        return [];
      }

      return Array.isArray(value) ? value : [value];
    },
    initialValue: [],
  },
);

export function array<T = unknown>(
  itemsSchema: Schema<T> | null = null,
  defaultValue?: T[],
): ArraySchema<T> {
  const result = schema(defaultValue) as ArraySchema<T>;

  if (itemsSchema) {
    result.of(itemsSchema);
    result.typeAlias += `<${itemsSchema.typeAlias}>`;
  }

  return result;
}
