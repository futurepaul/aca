var state = require("./state");

module.exports = {
	store: function() {
		localStorage.setItem('events', JSON.stringify(state.eventLog));
		localStorage.setItem('times', JSON.stringify(state.eventTimes));
	},
	populate: function() {
		state.eventLog = JSON.parse(localStorage.getItem('events'));
	  	state.eventTimes = JSON.parse(localStorage.getItem('times'));
	},
	clear: function() {
		if (window.confirm("Are you sure you want to clear events in localstorage?")) {
			localStorage.clear();
		}
	}
};