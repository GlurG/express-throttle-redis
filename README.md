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
var redis_wrapper = require("express-throttle-redis");

var app = express();
var redis_client = redis.createClient();

app.post("/search", throttle({
	"5/s",
	"store": redis_wrapper(redis_client)
}), function(req, res, next) {
	// ...
})
```

Neither `express-throttle` nor `express-throttle-redis` will expire / remove / cleanup any keys. This means that memory usage will grow unbounded as new requests are being processed. Thus, it is recommended to have a separate redis instance only for throttling purposes with a sensible `maxmemory` setting and `maxmemory-policy` set to `allkeys-lru`. Furthermore, you may want to disable the persistence layer altogether. Consult the [Redis documentation](http://redis.io/documentation) for more information.

## Performance

Some numbers gathered from running Apache Bench against `benchmark.js`.

### No throttling

```bash
ab -n 100000 http://localhost:3000/
This is ApacheBench, Version 2.3 <$Revision: 1706008 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Server Software:
Server Hostname:        localhost
Server Port:            3000

Document Path:          /
Document Length:        0 bytes

Concurrency Level:      1
Time taken for tests:   38.107 seconds
Complete requests:      100000
Failed requests:        0
Total transferred:      9800000 bytes
HTML transferred:       0 bytes
Requests per second:    2624.18 [#/sec] (mean)
Time per request:       0.381 [ms] (mean)
Time per request:       0.381 [ms] (mean, across all concurrent requests)
Transfer rate:          251.14 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.2      0       1
Processing:     0    0   0.5      0       9
Waiting:        0    0   0.4      0       9
Total:          0    0   0.5      0      10

Percentage of the requests served within a certain time (ms)
  50%      0
  66%      0
  75%      1
  80%      1
  90%      1
  95%      1
  98%      1
  99%      1
 100%     10 (longest request)
```

### Throttling (using default store)

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
Time taken for tests:   38.567 seconds
Complete requests:      100000
Failed requests:        0
Non-2xx responses:      3757
Total transferred:      9856355 bytes
HTML transferred:       0 bytes
Requests per second:    2592.88 [#/sec] (mean)
Time per request:       0.386 [ms] (mean)
Time per request:       0.386 [ms] (mean, across all concurrent requests)
Transfer rate:          249.57 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.2      0       1
Processing:     0    0   0.5      0       9
Waiting:        0    0   0.4      0       9
Total:          0    0   0.5      0       9

Percentage of the requests served within a certain time (ms)
  50%      0
  66%      0
  75%      1
  80%      1
  90%      1
  95%      1
  98%      1
  99%      1
 100%      9 (longest request)
```

### Throttling (using Redis store)

```bash
ab -n 100000 http://localhost:3000/throttle-redis
This is ApacheBench, Version 2.3 <$Revision: 1706008 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Server Software:
Server Hostname:        localhost
Server Port:            3000

Document Path:          /throttle-redis
Document Length:        0 bytes

Concurrency Level:      1
Time taken for tests:   46.760 seconds
Complete requests:      100000
Failed requests:        0
Non-2xx responses:      3138
Total transferred:      9847070 bytes
HTML transferred:       0 bytes
Requests per second:    2138.59 [#/sec] (mean)
Time per request:       0.468 [ms] (mean)
Time per request:       0.468 [ms] (mean, across all concurrent requests)
Transfer rate:          205.65 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.2      0       1
Processing:     0    0   0.6      0      14
Waiting:        0    0   0.6      0      14
Total:          0    0   0.6      0      14

Percentage of the requests served within a certain time (ms)
  50%      0
  66%      1
  75%      1
  80%      1
  90%      1
  95%      1
  98%      1
  99%      1
 100%     14 (longest request)
```