import { object } from './object';
import { AnySchema, schema } from './schema';

export function blueprint(defaultValue?: Record<string, AnySchema>) /* infer */ {
  return object(defaultValue).of(schema().notNullable());
}
