
var gui = require('nw.gui'); 

var app = angular.module('adventureApp');

app.service("previewService", function() {

	this.previewGame = function() {
		var new_win = gui.Window.open('https://github.com');
	}

});



