"use strict";

var editor = require("./cm");
require("./style.css");

var csp = require("js-csp");

var state = require("./state");
var storage = require("./storage");
var timeCop = require("./timecop");
var recording = require("./recording");
var playback = require("./playback");
var time = require("./time");

var displayTimeChan = csp.chan(csp.buffers.sliding(1));

csp.go(function*() {
  while(true) {
    var time = yield csp.take(displayTimeChan);
    playback.displayTimer(time);
  }
});

csp.putAsync(displayTimeChan, 42);

var startRecord = function() {
	state.recStartTime = time.rightNow();
	recording.shouldRecord(true);
};

var stopRecord = function() {
	recording.shouldRecord(false);
};

var play = function() {
	state.playStartTime = time.rightNow() - state.playTimeSoFar;
	playback.startLoop();
};

var reset = function() {
	state.playTimeSoFar = 0;
	state.step = 0;
	csp.putAsync(displayTimeChan, state.playTimeSoFar);
};

//would be nice to ship this ui stuff somewhere else
document.getElementById("start").onclick = startRecord;
document.getElementById("stop").onclick = stopRecord;
document.getElementById("populate").onclick = storage.populate;
document.getElementById("play").onclick = play;
document.getElementById("reset").onclick = reset;
document.getElementById("store").onclick = storage.store;
document.getElementById("clear").onclick = storage.clear;


//soundcloud


var widgetIframe = document.getElementById('sc-widget'),
widget = SC.Widget(widgetIframe);

widget.bind(SC.Widget.Events.READY, function() {
	widget.bind(SC.Widget.Events.PLAY, function() {
		widget.getPosition(gettime);
		play();
    	widget.getPosition(logtimes);
    });
    widget.bind(SC.Widget.Events.PAUSE, function() {
    	playback.stopLoop();
//    	step = widget.getPosition(gettime);
    	widget.getPosition(logtimes);
    });
});

var logtimes = function (scposition) {
	console.log("my time: " + state.playTimeSoFar + " sctime: " + scposition);
	console.log(timeCop(state.eventTimes, scposition));
};

var gettime = function (scposition) {
	state.playTimeSoFar = Math.ceil(scposition);
};


