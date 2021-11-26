import { isString } from '@immutabl3/utils';

export default function normalizeKey(key) {
  return isString(key) ? key : `${key}`;
};