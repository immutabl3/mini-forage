# mini-forage

mini-forage is a fast and simple storage library for indexeddb
with an asyncronous localStorage-esque API

### Install

```bash
npm install @immutabl3/mini-forage
```

## How to use

### Async

Because miniforage uses async storage, all methods return an promise.
It's otherwise exactly the same as the
[localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

```js
import miniforage from '@immutabl3/mini-forage';

await miniforage.setItem('key', 'value');

const result = await miniforage.getItem('key');
// result === 'value'
```

### Storing Blobs, TypedArrays, and other JS objects

You can store JSON, ArrayBuffers, Blobs and TypedArrays in miniforage. miniforage
automatically `JSON.parse()` and `JSON.stringify()` values when getting/setting

## Multiple instances

You can create multiple instances of miniforage that point to different stores

``` javascript
import { MiniForage } from '@immutabl3/mini-forage';
const store = MiniForage({
  name: "nameHere"
});

const otherStore = MiniForage({
  name: "otherName"
});

// Setting the key on one of these doesn't affect the other.
store.setItem('key', 'value');
otherStore.setItem('key', 'value2');
```

### Library Size
As of version `1.0.0` the payload added to your app is rather small. Served using gzip compression, miniforage will add less than `1.5k` to your total bundle size:

<dl>
  <dt>minified</dt><dd>`~3.9kB`</dd>
  <dt>gzipped</dt><dd>`~1.3kB`</dd>
  <dt>brotli'd</dt><dd>`~1.1kB`</dd>
</dl>

# License

[MIT](https://github.com/immutabl3/mini-forage/blob/master/LICENSE)å