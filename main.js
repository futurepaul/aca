
var CodeMirror = require("codemirror/lib/codemirror");

require("codemirror/mode/javascript/javascript");
require("codemirror/addon/search/match-highlighter");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/selection/active-line");
require("codemirror/addon/selection/mark-selection");

var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    lineNumbers: true,
    mode: "javascript",
    highlightSelectionMatches: true,
    matchBrackets: true,
    styleActiveLine: true,
    styleSelectedText: true
});

var starttime;
var timesofar;
var recording;
var delay;

var start = function() {
	starttime = Date.now();
	recording = true;
	console.log(starttime);
};

var stop = function() {
	recording = false;
};

var step = 0;

var replay = function() {
	step = 0;
	starttime = Date.now();
	window.requestAnimationFrame(renderStep);
};

function renderStep(reqID) {
	if (step < eventLog.length) {
		timesofar = Date.now() - starttime;
		if (timesofar > replayRender(eventLog, step)) {
			step++;
		}
		displayTimer(timesofar);
		window.requestAnimationFrame(renderStep);
	} else {
		window.cancelAnimationFrame(renderStep);
		console.log("That's it!");
	}
}


var displayTimer = function(time) {
	document.getElementById("time").textContent=time;
};

document.getElementById("start").onclick = start;
document.getElementById("stop").onclick = stop;
document.getElementById("replay").onclick = replay;

var eventLog = [];

var posFromEvent = function(event) {
	var anchor = event[0].anchor;
	var head = event[0].head;
	var time = Date.now();
	timesofar = time - starttime;
	return {anchor: anchor, head: head, time: timesofar};
};


editor.doc.on("cursorActivity", function() {
	if (recording) {
		eventLog.push(posFromEvent(editor.doc.listSelections()));
		displayTimer(timesofar);
		console.log(eventLog);
	}
});

var updateSel = function(anchor, head) {
	editor.doc.setSelection(anchor, head);
};

var replayRender = function(events, step) {
	event = events[step];
	anchor = event.anchor;
	head = event.head;
	eventTime = event.time;
	updateSel(anchor, head);
	displayTimer(eventTime);
	if (step < events.length - 1) {
	 	return events[step + 1].time;
	} else {
	 	return eventTime;
	}
};

