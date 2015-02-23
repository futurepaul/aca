module.exports = function (array, time) {
	var bestguess = Math.ceil(time);
	if (bestguess >= 0) {
		while (array.indexOf(bestguess) == -1 && bestguess > 0) {
			bestguess--;
		}
		return Math.max(0, array.indexOf(bestguess));
	} else {
		return 0;
	}
};