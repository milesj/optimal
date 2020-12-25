import { instance } from './instance';

export function regex() /* infer */ {
  return instance().of(RegExp);
}
