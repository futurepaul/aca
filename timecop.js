function timeCop (array, time) {
	var bestguess = time;
	if (array.indexOf(time) !== -1) {
		return array.indexOf(time);
	} else {
		bestguess--;
		timeCop(array, bestguess);
	}
}

