import isString from './isString';

export default function normalizeKey(key) {
  return isString(key) ? key : `${key}`;
};