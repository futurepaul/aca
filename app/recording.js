var editor = require("./cm");
var state = require("./state");

timesofar = state.timesofar;
starttime = state.starttime;

var posFromEvent = function(event) {
	var anchor = event[0].anchor;
	var head = event[0].head;
	var time = Date.now();
	timesofar = time - starttime;
	return {anchor: anchor, head: head, time: timesofar};
};

var observeCursor = function(cm) {
	state.eventLog.push(posFromEvent(cm.listSelections()));
	state.eventTimes.push(timesofar);
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