var editor = require("./cm");
require("./style.css");

var state = require("./state");
var storage = require("./storage");
var timeCop = require("./timecop");
var recording = require("./recording");

starttime = state.starttime;
timesofar = state.timesofar;

var delay;
var requestId;

var step = 0;

var start = function() {
	starttime = Date.now();
	recording.shouldRecord(true);
	console.log(starttime);
};

var stop = function() {
	recording.shouldRecord(false);
};

function renderLoop() {
	if (step < state.eventLog.length) {
		timesofar = Date.now() - starttime;
		//this gross > code is what actually mutates the dom
		if (timesofar > replayRender(state.eventLog, step)) {
			step++;
		}
		displayTimer(timesofar);
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

var replay = function() {
  starttime = Date.now();
  startLoop();
};

//would be nice to ship this ui stuff somewhere else
var displayTimer = function(time) {
	document.getElementById("time").textContent=time;
};

document.getElementById("start").onclick = start;
document.getElementById("stop").onclick = stop;
document.getElementById("populate").onclick = storage.populate;
document.getElementById("replay").onclick = replay;
document.getElementById("store").onclick = storage.store;
document.getElementById("clear").onclick = storage.clear;


var updateSel = function(anchor, head) {
	editor.doc.setSelection(anchor, head);
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


//soundcloud


var widgetIframe = document.getElementById('sc-widget'),
widget = SC.Widget(widgetIframe);

widget.bind(SC.Widget.Events.READY, function() {
	widget.bind(SC.Widget.Events.PLAY, function() {
//		step = widget.getPosition(gettime) || 0;
		replay();
    	widget.getPosition(logtimes);
    });
    widget.bind(SC.Widget.Events.PAUSE, function() {
    	stopLoop();
//    	step = widget.getPosition(gettime);
    	widget.getPosition(logtimes);
    });
});

var logtimes = function (scposition) {
	console.log("my time: " + timesofar + " sctime: " + scposition);
	console.log(timeCop(state.eventTimes, scposition));
};

var gettime = function (scposition) {
	timeCop(state.eventTimes, scposition);
};


