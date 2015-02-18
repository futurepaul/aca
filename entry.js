var editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
editor.getSession().setMode("ace/mode/javascript");
editor.setHighlightSelectedWord(true);
editor.setShowFoldWidgets(false);
editor.setShowPrintMargin(false);

var recordevents = 0;
var stopped;
var starttime;
var timesofar;

var start = function() {
	starttime = Date.now();
	editor.setReadOnly(true);
	recordevents = window.requestAnimationFrame(logpos);
};

var stop = function() {
	editor.setReadOnly(false);
	window.cancelAnimationFrame(recordevents);
};

var step = 0;

var replay = function() {
	var spot = JSON.parse(eventlog[step].cursor);
	var selectrange = JSON.parse(eventlog[step].selection);
	editor.clearSelection();
	editor.moveCursorToPosition(spot);
	console.log(selectrange.start.row);
//	var startcol = selectrange["start"]["column"];
//	var endrow = selectrange["end"]["row"];
//	var endcol = selectrange["end"]["column"];
//	var range = new Range(startrow, startcol, endrow, endcol);
//	editor.setSelectionRange(range);
	console.log(spot);
//	console.log(selectrange);
	step ++;
};



document.getElementById("start").onclick = start;
document.getElementById("stop").onclick = stop;
document.getElementById("replay").onclick = replay;

var lastpos;
var currentpos;

var lastsel;
var currentsel;

var eventlog = [];

var getpos = function() {
	return JSON.stringify(editor.getCursorPosition());
};

var getsel = function() {
	return JSON.stringify(editor.getSelectionRange());
};

var logstate = function() {
	eventlog.push({cursor: currentpos, selection: currentsel, time: Date.now()});
};

var logpos = function(timestamp) {
	currentpos = getpos();
	currentsel = getsel();

	timesofar = Date.now() - starttime;

	if (currentsel != lastsel) {
		console.log("sel:" + currentsel + timesofar);
		lastsel = currentsel;
		logstate();
		console.log(eventlog);
	}
	else if (currentpos != lastpos) {
		console.log("curs:" + currentpos + timesofar);
		lastpos = currentpos;
		logstate();
		console.log(eventlog);
	}

	document.getElementById("time").textContent=timesofar;

	recordevents = window.requestAnimationFrame(logpos);
};