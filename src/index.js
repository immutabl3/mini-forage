import deferred from './utils/deferred.js';
import idbDriver from './indexeddb.js';

export const MiniForage = function(options = {}) {
  let requesting;
  let ready = false;

  return {
    memory: new Map(),

    dbInfo: {},

    config: {
      description: '',
      driver: 'indexeddb',
      name: 'mini-forage',
      // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
      // we can use without a prompt.
      size: 4980736,
      storeName: 'keyvaluestore',
      version: 1,
      ...options
    },

    async ready() {
      if (ready === true) return true;
      if (requesting) return requesting;

      const {
        resolve,
        promise,
      } = deferred();

      requesting = promise;

      this.dbInfo = await idbDriver.initStorage(this.config);
      
      Object.assign(this, idbDriver);

      ready = true;
      resolve();
      requesting = undefined;

      return ready;
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