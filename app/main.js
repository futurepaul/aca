var editor = require("./cm");
require("./style.css");

var state = require("./state");
var storage = require("./storage");
var timeCop = require("./timecop");
var recording = require("./recording");
var playback = require("./playback");

var start = function() {
	state.starttime = Date.now();
	recording.shouldRecord(true);
	console.log(state.starttime);
};

var stop = function() {
	recording.shouldRecord(false);
};

var replay = function() {
  state.starttime = Date.now();
  playback.startLoop();
};

//would be nice to ship this ui stuff somewhere else


document.getElementById("start").onclick = start;
document.getElementById("stop").onclick = stop;
document.getElementById("populate").onclick = storage.populate;
document.getElementById("replay").onclick = replay;
document.getElementById("store").onclick = storage.store;
document.getElementById("clear").onclick = storage.clear;


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
	console.log("my time: " + state.timesofar + " sctime: " + scposition);
	console.log(timeCop(state.eventTimes, scposition));
};

var gettime = function (scposition) {
	timeCop(state.eventTimes, scposition);
};


