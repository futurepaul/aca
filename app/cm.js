var CodeMirror = require("codemirror/lib/codemirror");

require("codemirror/lib/codemirror.css");


require("codemirror/mode/javascript/javascript");
require("codemirror/addon/search/match-highlighter");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/selection/active-line");
require("codemirror/addon/selection/mark-selection");

module.exports = CodeMirror.fromTextArea(document.getElementById("editor"), {
    lineNumbers: true,
    mode: "javascript",
    highlightSelectionMatches: true,
    matchBrackets: true,
    styleActiveLine: true,
    styleSelectedText: true
});