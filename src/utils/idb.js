export default globalThis.indexedDB || 
  globalThis.webkitIndexedDB || 
  globalThis.mozIndexedDB ||
  globalThis.OIndexedDB ||
  globalThis.msIndexedDB ||
  undefined;
