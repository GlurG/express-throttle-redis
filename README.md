# express-throttle-redis
Redis wrapper for express-throttle

[![npm version](https://badge.fury.io/js/express-throttle-redis.svg)](https://badge.fury.io/js/express-throttle-redis)

## Installation

```bash
$ npm install express-throttle-redis
```

## Usage

```js
var express = require("express");
var throttle = require("express-throttle");
var redis = require("redis");
var RedisStore = require("express-throttle-redis");

var app = express();

// Rolling window
app.post("/search", throttle({
  "burst": 10,
	"rate": "5/s",
	"store": new RedisStore(redis.createClient())
}), function(req, res, next) {
	// ...
})

// Fixed window
app.post("/search", throttle({
  "burst": 10,
  "period": "1min",
  "store": new RedisStore(redis.createClient())
}), function(req, res, next) {
  // ...
})
```

Neither `express-throttle` nor `express-throttle-redis` will expire / remove / cleanup any keys. This means that memory usage will grow unbounded as new requests are being processed. Thus, it is recommended to have a separate redis instance only for throttling purposes with a sensible `maxmemory` setting and `maxmemory-policy` set to `allkeys-lru`. Furthermore, you may want to disable the persistence layer altogether. Consult the [Redis documentation](http://redis.io/documentation) for more information.
