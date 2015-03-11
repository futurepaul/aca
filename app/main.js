"use strict";

//library-dependent
var editor = require("./cm");
require("./style.css");
require("./sc");
var Actions = require("./re");

//my stuff
var storage = require("./storage");


//wire up the ui
document.getElementById("start").onclick = Actions.startRecord;
document.getElementById("stop").onclick = Actions.stopRecord;
document.getElementById("populate").onclick = storage.populate;
document.getElementById("play").onclick = Actions.play;
document.getElementById("store").onclick = storage.store;
document.getElementById("clear").onclick = storage.clear;

