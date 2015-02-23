var Peer = require("peerjs");

var myid;
var theirid;
var peer;
var conn;

var share = function () {
	myid = prompt("pick an id!");
	peer = new Peer(myid, {key: 'lzdeu0nyqmovquxr'}); 
};

var whowith = function () {
	theirid = prompt("who?");
	conn = peer.connect(theirid);
};

var begin = function () {
	conn.on('open', function(){
  		conn.send('hi!');
	});

	peer.on('connection', function(conn) {
  		conn.on('data', function(data){
    		// Will print 'hi!'
    		console.log(data);
  		});
	});
};

document.getElementById("share").onclick = share;
document.getElementById("whowith").onclick = whowith;
document.getElementById("begin").onclick = begin;

