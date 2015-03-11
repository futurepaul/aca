var Actions = require("./re");

var widgetIframe = document.getElementById('sc-widget'),

widget = SC.Widget(widgetIframe);

var babysitter;

var player = widget.bind(SC.Widget.Events.READY, function() {
	widget.bind(SC.Widget.Events.PLAY, function() {
		widget.getPosition(Actions.setPos);
		Actions.startLoop();
    });
    widget.bind(SC.Widget.Events.PAUSE, function() {
    	Actions.stopLoop();
    });
    widget.bind(SC.Widget.Events.SEEK, function() {
    	widget.getPosition(Actions.setPos);
    	Actions.startLoop();
    });
    widget.bind(SC.Widget.Events.PLAY_PROGRESS, widget.getPosition(function() {console.log(position)}));
});

module.exports = player;