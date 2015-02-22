var editor = require("./cm");
var state = require("./state");
var time = require("./time");

var updateSel = function(anchor, head) {
	editor.doc.setSelection(anchor, head);
};

var displayTimer = function(time) {
	document.getElementById("time").textContent=time;
};

var replayRender = function(events, step) {
	updateSel(events[step].anchor, events[step].head);
};

var renderLoop = function() {
	if (state.playing) {
		if (state.step < state.eventTimes.length) {
			var step = state.step;
			var nextstep = state.step + 1;
			replayRender(state.eventLog, step);
			displayTimer(state.eventTimes[step]);
			var wait = time.between(state.eventTimes[step], state.eventTimes[nextstep]);
			setTimeout(function() {
				state.step++;
				renderLoop();
			}, wait);
		} else {
			state.playing = false;
			console.log("That's it!");
		}
}

};

function startLoop() {
	state.playing = true;
    renderLoop();
}

function stopLoop() {
	state.playing = false;
}

module.exports = {
	startLoop: startLoop,
	stopLoop: stopLoop,
	displayTimer: displayTimer
};