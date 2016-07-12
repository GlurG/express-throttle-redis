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

app.post("/search", throttle({
	"5/s",
	"store": new RedisStore(redis.createClient())
}), function(req, res, next) {
	// ...
})
```

Neither `express-throttle` nor `express-throttle-redis` will expire / remove / cleanup any keys. This means that memory usage will grow unbounded as new requests are being processed. Thus, it is recommended to have a separate redis instance only for throttling purposes with a sensible `maxmemory` setting and `maxmemory-policy` set to `allkeys-lru`. Furthermore, you may want to disable the persistence layer altogether. Consult the [Redis documentation](http://redis.io/documentation) for more information. Also, beware of the [limitations](https://github.com/GlurG/express-throttle/blob/master/README.md) of using this package.

## Performance

Apache Bench was run against [benchmark.js](https://github.com/GlurG/express-throttle-redis/blob/master/test/benchmark.js) and a Redis instance with `maxmemory = 8mb` and `maxmemory-policy = allkeys-lru`.

Performance tests for `express-throttle` can be found [here](https://github.com/GlurG/express-throttle/blob/master/Benchmark.md) for comparison.

### Throttling (Redis store, sliding windows)

```bash
ab -n 100000 http://localhost:3000/throttle
This is ApacheBench, Version 2.3 <$Revision: 1706008 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Server Software:
Server Hostname:        localhost
Server Port:            3000

Document Path:          /throttle
Document Length:        0 bytes

Concurrency Level:      1
Time taken for tests:   46.975 seconds
Complete requests:      100000
Failed requests:        0
Non-2xx responses:      22649
Total transferred:      10139735 bytes
HTML transferred:       0 bytes
Requests per second:    2128.81 [#/sec] (mean)
Time per request:       0.470 [ms] (mean)
Time per request:       0.470 [ms] (mean, across all concurrent requests)
Transfer rate:          210.80 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.2      0       1
Processing:     0    0   0.6      0      16
Waiting:        0    0   0.6      0      16
Total:          0    0   0.6      0      16

Percentage of the requests served within a certain time (ms)
  50%      0
  66%      1
  75%      1
  80%      1
  90%      1
  95%      1
  98%      1
  99%      1
 100%     16 (longest request)
```

### Throttling (Redis store, fixed windows)

```bash
ab -n 100000 http://localhost:3000/throttle-fixed
This is ApacheBench, Version 2.3 <$Revision: 1706008 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Server Software:
Server Hostname:        localhost
Server Port:            3000

Document Path:          /throttle-fixed
Document Length:        0 bytes

Concurrency Level:      1
Time taken for tests:   48.573 seconds
Complete requests:      100000
Failed requests:        0
Non-2xx responses:      22072
Total transferred:      10131080 bytes
HTML transferred:       0 bytes
Requests per second:    2058.77 [#/sec] (mean)
Time per request:       0.486 [ms] (mean)
Time per request:       0.486 [ms] (mean, across all concurrent requests)
Transfer rate:          203.69 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.2      0       1
Processing:     0    0   0.6      0      16
Waiting:        0    0   0.6      0      16
Total:          0    0   0.6      0      16

Percentage of the requests served within a certain time (ms)
  50%      0
  66%      1
  75%      1
  80%      1
  90%      1
  95%      1
  98%      1
  99%      1
 100%     16 (longest request)
```