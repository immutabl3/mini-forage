import { noop } from '@immutabl3/utils';

const unregister = (transaction, req) => {
  req.onsuccess = transaction.oncomplete = req.onerror = transaction.onabort = transaction.onerror = noop;
};

export default function listen(transaction, request) {
  return new Promise((resolve, reject) => {
    const req = request();

    req.onsuccess = transaction.oncomplete = value => {
      unregister(transaction, req);
      resolve(req.result === undefined ? value : req.result);
    };
    
    req.onerror = transaction.onabort = transaction.onerror = err => {
      unregister(transaction, req);
      reject(req.error ?? transaction.error ?? err);
    };
  });
};