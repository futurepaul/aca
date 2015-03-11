var Reflux = require("reflux");
var playback = require("./playback");
var timeCop = require("./timecop");
var recording = require("./recording");
var state = require("./state");
var time = require("./time");

var Actions = Reflux.createActions([
    "play",
    "startRecord",
    "stopRecord",
    "startLoop",
    "stopLoop",
    "setPos"
  ]);

var Store = Reflux.createStore({
    listenables: Actions,
    onPlay: function(){
    	state.step = 0;
        Actions.startLoop();
    },
    onStartRecord: function() {
		state.recStartTime = time.rightNow();
		recording.shouldRecord(true);
	},
	onStopRecord: function() {
		recording.shouldRecord(false);
	},
	onStartLoop: function() {
		state.playing = true;
    	playback.renderLoop();
	},
	onStopLoop: function() {
		state.playing = false;
	},
	onSetPos: function (scposition) {
		state.step = timeCop(state.eventTimes, scposition);
		console.log("t:" + state.playTimeSoFar + ", step: " + state.step + ", sc:" + scposition);
	}
});

module.exports = Actions;