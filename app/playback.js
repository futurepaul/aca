var editor = require("./cm");
var state = require("./state");
var time = require("./time");

var requestId;

var updateSel = function(anchor, head) {
	editor.doc.setSelection(anchor, head);
};

var displayTimer = function(time) {
	document.getElementById("time").textContent=time;
};

var replayRender = function(events, step) {
	var event = events[step];
	var anchor = event.anchor;
	var head = event.head;
	var eventTime = event.time;
	updateSel(anchor, head);
	if (step < events.length - 1) {
	 	return events[step + 1].time;
	} else {
	 	return eventTime;
	}
};

function renderLoop() {
	if (state.step < state.eventLog.length) {
		state.playTimeSoFar = time.since(state.playStartTime);
		//this gross > code is what actually mutates the dom
		if (state.playTimeSoFar > replayRender(state.eventLog, state.step)) {
			state.step++;
		}
		displayTimer(state.playTimeSoFar);
		requestId = window.requestAnimationFrame(renderLoop);
	} else {
		stopLoop();
		console.log("That's it!");
	}
}

function startLoop() {
	if (!requestId) {
       renderLoop();
    }
}

function stopLoop() {
	if (requestId) {
       window.cancelAnimationFrame(requestId);
       requestId = undefined;
    }
}

module.exports = {
	startLoop: startLoop,
	stopLoop: stopLoop,
	displayTimer: displayTimer
};