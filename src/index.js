import idbDriver from './indexeddb.js';

const READY = Symbol('ready');

export const MiniForage = function(options = {}) {
  return {
    dbInfo: {},
    config: {
      description: '',
      driver: 'indexeddb',
      name: 'mini-forage',
      // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
      // we can use without a prompt.
      size: 4980736,
      storeName: 'keyvaluepairs',
      version: 1,
      ...options
    },

    [READY]: false,

    async ready() {
      if (this[READY] === true) return true;

      this.dbInfo = await idbDriver.initStorage(this.config);
      
      Object.assign(this, idbDriver);

      return (this[READY] = true);
    },

    // add a stub for each driver API method that delays the call to the
    // corresponding driver method until ready. These stubs
    // will be replaced by the driver methods as soon as the driver is
    // loaded, so there is no performance impact.
    async clear() {
      await this.ready();
      return this.clear();
    },
    async setItem(key, value) {
      await this.ready();
      return this.setItem(key, value);
    },
    async getItem(key) {
      await this.ready();
      return this.getItem(key);
    },
    async iterate(iterator) {
      await this.ready();
      return this.iterate(iterator);
    },
    async has(key) {
      await this.ready();
      return this.has(key);
    },
    async key(n) {
      await this.ready();
      return this.key(n);
    },
    async keys() {
      await this.ready();
      return this.keys();
    },
    async length() {
      await this.ready();
      return this.length();
    },
    async removeItem(key) {
      await this.ready();
      return this.removeItem(key);
    },
  };
};

export default MiniForage();