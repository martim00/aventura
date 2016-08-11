
var gui = require('nw.gui'); 

var app = angular.module('adventureApp');

app.service("previewService", function() {

	this.previewGame = function(indexFile) {
		// var new_win = gui.Window.open('file:///c:/users/aniceto/workspace/aventura/desktop/game-folder/index.html');
		var new_win = gui.Window.open('file:///' + indexFile);
	}

	this.liveReload = function() {
		var iframe = document.getElementById('game-preview');
		iframe.src += '';	
	}

});



