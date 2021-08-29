import { AnySchema, DefaultValue } from '../types';
import { object } from './object';
import { schema } from './schema';

export function blueprint(defaultValue?: DefaultValue<Record<string, AnySchema>>) /* infer */ {
	return object(defaultValue).of(schema().notNullable());
}
