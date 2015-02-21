var editor = require("./cm");
var state = require("./state");
var time = require("./time");

var posFromEvent = function(event) {
	var anchor = event[0].anchor;
	var head = event[0].head;
	state.timesofar = time.since(state.recStartTime);
	return {anchor: anchor, head: head, time: state.timesofar};
};

var observeCursor = function(cm) {
	state.eventLog.push(posFromEvent(cm.listSelections()));
	state.eventTimes.push(state.timesofar);
	console.log(state.eventLog);
	console.log(state.eventTimes);
};

module.exports = {
	shouldRecord: function(recording) {
		if (recording) {
			editor.doc.on("cursorActivity", observeCursor);
		} else {
			editor.doc.off("cursorActivity", observeCursor);
		}
	}
};