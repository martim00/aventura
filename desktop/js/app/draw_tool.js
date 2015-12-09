goog.provide("aventura.app.DrawTool");

aventura.app.DrawTool = function(canvas, actualGame) {

	DbC.requireNotNull(canvas, "canvas");
	DbC.requireNotNull(actualGame, "actualGame");

	this.canvas = canvas;
	this.actualGame = actualGame;
	this.drawInteraction = new aventura.app.DrawInteraction(this.canvas);
	this.drawInteraction.onPolygonCompleted(this.addWalkableArea.bind(this));
}

aventura.app.DrawTool.prototype.addWalkableArea = function(polygon) {
	this.actualGame.createWalkableArea(polygon);
}

aventura.app.DrawTool.prototype.activate = function() {
	this.drawInteraction.start();
}

aventura.app.DrawTool.prototype.deactivate = function() {
	this.drawInteraction.stop();
}
