var editor = require("./cm");
var state = require("./state");

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
	displayTimer(eventTime);
	if (step < events.length - 1) {
	 	return events[step + 1].time;
	} else {
	 	return eventTime;
	}
};

function renderLoop() {
	if (state.step < state.eventLog.length) {
		state.timesofar = Date.now() - state.starttime;
		//this gross > code is what actually mutates the dom
		if (state.timesofar > replayRender(state.eventLog, state.step)) {
			state.step++;
		}
		displayTimer(state.timesofar);
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
	startLoop: startLoop
};