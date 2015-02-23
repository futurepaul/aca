"use strict";

var editor = require("./cm");
var peer = require("./peer");

require("./style.css");

var state = require("./state");
var storage = require("./storage");
var timeCop = require("./timecop");
var recording = require("./recording");
var playback = require("./playback");
var time = require("./time");

var startRecord = function() {
	state.recStartTime = time.rightNow();
	recording.shouldRecord(true);
};

var stopRecord = function() {
	recording.shouldRecord(false);
};

var play = function() {
	playback.startLoop();
};

var reset = function() {
	state.step = 0;
	playback.displayTimer(0);
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

var babysitter;

widget.bind(SC.Widget.Events.READY, function() {
	widget.bind(SC.Widget.Events.PLAY, function() {
		widget.getPosition(setPos);
		babysitter = setInterval(function(){
			widget.getPosition(setPos);
		}, 1000)
		playback.startLoop();
    });
    widget.bind(SC.Widget.Events.PAUSE, function() {
    	clearInterval(babysitter)
    	playback.stopLoop();
    });
    widget.bind(SC.Widget.Events.SEEK, function() {
    	clearInterval(babysitter)
    	babysitter = window.setInterval(function(){
			widget.getPosition(setPos);
		}, 1000)
    	playback.startLoop();
    });
});

var stupid1secloop = function () {

}

var setPos = function (scposition) {
	state.step = timeCop(state.eventTimes, scposition);
	console.log("t:" + state.playTimeSoFar + ", step: " + state.step + ", sc:" + scposition)
};

