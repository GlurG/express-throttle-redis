"use strict";

module.exports = function(redis) {
	return new Wrapper(redis);
};

function Wrapper(redis) {
	this.redis = redis;
}

Wrapper.prototype.get = function(key, callback) {
	this.redis.get(key, function(err, bucket) {
		callback(err, JSON.parse(bucket));
	});
};

Wrapper.prototype.set = function(key, bucket, lifetime, callback) {
	this.redis.send_command("set", [key, JSON.stringify(bucket), "px", lifetime], callback);
};
