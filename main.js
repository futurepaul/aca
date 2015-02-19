var CodeMirror = require("codemirror/lib/codemirror");

require("codemirror/lib/codemirror.css");
require("./style.css");

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
var requestId;

var step = 0;

var eventLog = [];
var eventTimes = [];

var start = function() {
	starttime = Date.now();
	recording = true;
	console.log(starttime);
};

var stop = function() {
	recording = false;
};


var timeCop = function (array, time) {
	var bestguess = Math.ceil(time);
  	while (array.indexOf(bestguess) == -1 && bestguess !== 0) {
    	bestguess--;
	}
  	return array.indexOf(bestguess);
};

function renderLoop() {
	if (step < eventLog.length) {
		timesofar = Date.now() - starttime;
		if (timesofar > replayRender(eventLog, step)) {
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
  if (localStorage.length === 0) {
  	startLoop();
  } else {
  	eventLog = JSON.parse(localStorage.getItem('events'));
  	eventTimes = JSON.parse(localStorage.getItem('times'));
  	console.log(timeCop(eventTimes, 4000));
  	startLoop();
  }
};

var clear = function() {
	if (window.confirm("Are you sure you want to clear events in localstorage?")) {
		localStorage.clear();
	}
};

var store = function() {
	localStorage.setItem('events', JSON.stringify(eventLog));
	localStorage.setItem('times', JSON.stringify(eventTimes));
};

var displayTimer = function(time) {
	document.getElementById("time").textContent=time;
};

document.getElementById("start").onclick = start;
document.getElementById("stop").onclick = stop;
document.getElementById("replay").onclick = replay;
document.getElementById("store").onclick = store;
document.getElementById("clear").onclick = clear;

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
		eventTimes.push(timesofar);
		displayTimer(timesofar);
		console.log(eventLog);
		console.log(eventTimes);
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


//soundcloud


var widgetIframe = document.getElementById('sc-widget'),
widget = SC.Widget(widgetIframe);

widget.bind(SC.Widget.Events.READY, function() {
	widget.bind(SC.Widget.Events.PLAY, function() {
    	replay();
    	widget.getPosition(logtimes);
    });
    widget.bind(SC.Widget.Events.PAUSE, function() {
    	stopLoop();
    	widget.getPosition(logtimes);
    });
});

var logtimes = function (scposition) {
	console.log("my time: " + timesofar + " sctime: " + scposition);
	console.log(timeCop(eventTimes, scposition));
};

var gettime = function (scposition) {
	timeCop(eventTimes, scposition);
};


