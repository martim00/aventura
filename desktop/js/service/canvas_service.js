var app = angular.module('adventureApp');

app.service("canvasService", function() {

	this.canvas = new aventura.app.EditorCanvas();

	this.init = function(actualGame) {
		this.canvas.init(actualGame);
	}

	this.invalidate = function() {
		this.canvas.invalidate();
	}

	this.getCanvas = function() {
		return this.canvas;
	}

});