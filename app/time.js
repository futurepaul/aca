var rightNow = function() {
	return Date.now();
};

var between = function(time1, time2) {
	return Math.abs(time1 - time2);
};

var since = function(start) {
	return between(rightNow(), start);
};

module.exports = {
	rightNow: rightNow,
	between: between,
	since: since
};