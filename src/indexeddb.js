import { defer } from '@immutabl3/utils';
import idb from './utils/idb.js';
import normalizeKey from './utils/normalizeKey.js';
import listen from './utils/listen.js';

const READ_ONLY = 'readonly';
const READ_WRITE = 'readwrite';
const TRANSACTION_OPTIONS = { durability: 'relaxed' };

const getConnection = async function(dbInfo) {
  return new Promise(function(resolve, reject) {
    const req = idb.open(dbInfo.name, dbInfo.version);

    req.onerror = function(e) {
      e.preventDefault();
      reject(req.error);
    };

    req.onupgradeneeded = function({ target: { result: db } }) {
      db.onerror = () => console.error('error loading database');

      try {
        db.createObjectStore(dbInfo.storeName);
      } catch {}
    };

    req.onsuccess = function() {
      resolve(req.result);
    };
  });
};

const createTransaction = async function(dbInfo, mode) {
  return dbInfo.db.transaction([dbInfo.storeName], mode, TRANSACTION_OPTIONS);
};

export default {
  async initStorage(config) {
    return {
      db: await getConnection(config),
      ...config
    };
  },
  
  async iterate(iterator) {
    const transaction = await createTransaction(this.dbInfo, READ_ONLY);
    const store = transaction.objectStore(this.dbInfo.storeName);

    return new Promise(function(resolve, reject) { 
      let iteration = 1;
      
      const req = store.openCursor();

      req.onsuccess = function() {
        const cursor = req.result;

        if (!cursor) return resolve();
        
        const result = iterator(
          cursor.key,
          cursor.value,
          iteration++
        );

        if (result === false) return resolve(result);
        
        cursor.continue();
      };

      req.onerror = function() {
        reject(req.error);
      };
    });
  },
    
  async getItem(rawKey) {
    const key = normalizeKey(rawKey);
    return this.memory.get(key);
  },
  
  async setItem(rawKey, value) {
    const key = normalizeKey(rawKey);   
    this.memory.set(key, value);
    
    defer(async () => {
      const transaction = await createTransaction(this.dbInfo, READ_WRITE);
      const store = transaction.objectStore(this.dbInfo.storeName);
      listen(transaction, () => store.put(value, key));
    });

    return value;
  },

  async removeItem(rawKey) {
    const key = normalizeKey(rawKey);
    this.memory.delete(key);

    defer(async () => {
      const transaction = await createTransaction(this.dbInfo, READ_WRITE);
      const store = transaction.objectStore(this.dbInfo.storeName);
      listen(transaction, () => store.delete(key));
    });
  },
  
  async clear() {
    this.memory.clear();

    defer(async () => {
      const transaction = await createTransaction(self.dbInfo, READ_WRITE);
      const store = transaction.objectStore(this.dbInfo.storeName);
      listen(transaction, () => store.clear());
    });
  },

  async length() {
    return this.memory.size;
  },

  async has(rawKey) {    
    const key = normalizeKey(rawKey);
    return this.memory.has(key);
  },

  async key(n) {
    if (n < 0) return;

    const transaction = await createTransaction(this.dbInfo, READ_ONLY);
    const store = transaction.objectStore(this.dbInfo.storeName);
    
    return new Promise((resolve, reject) => {
      let advanced = false;

      const req = store.openKeyCursor();

      req.onsuccess = function() {
        const cursor = req.result;
        
        // this means there weren't enough keys
        if (!cursor) return resolve(null);

        // we have the first key, return it if that's what they wanted
        if (n === 0) return resolve(cursor.key);

        if (!advanced) {
          // otherwise, ask the cursor to skip ahead n records
          advanced = true;
          cursor.advance(n);
          return;
        }

        // when we get here, we've got the nth key
        resolve(cursor.key);
      };

      req.onerror = () => reject(req.error);
    });
  },

  async keys() {
    return Array.from(this.memory.keys());
  },
};