"use strict";

module.exports = function(redis) {
	return new Wrapper(redis);
};

function Wrapper(redis) {
	this.redis = redis;
}

Wrapper.prototype.get = function(key, callback) {
	this.redis.get(key, (err, result) => {
		callback(err, JSON.parse(result));
	});
};

Wrapper.prototype.set = function(key, bucket, callback) {
	this.redis.set(key, JSON.stringify(bucket), callback);
};
