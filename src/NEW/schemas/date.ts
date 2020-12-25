import { instance } from './instance';

export function date() /* infer */ {
  return instance().of(Date);
}
