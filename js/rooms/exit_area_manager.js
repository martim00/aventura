goog.provide('aventura.ExitAreaManager');

aventura.ExitAreaManager = function(game, engine) {
	this.game = game;
	this.engine = engine;
}

aventura.ExitAreaManager.prototype.init = function(roomData) {

	this.exitAreas = [];

	var polygonArray = [];
	roomData.exits.forEach(function(exitData) {
		
    	exitArea = new Phaser.Polygon();
    	this.exitAreas.push({"polygon" : exitArea, "goTo" : exitData.goTo});
		exitData.polygon.forEach(function(point) {
			polygonArray.push(new Phaser.Point(point[0], point[1]));
		});
		exitArea.setTo(polygonArray);
    	graphics = this.game.add.graphics(0, 0);

    	graphics.alpha = debug ? 0.5 : 0;

    	graphics.beginFill(0xF8333f);
    	graphics.drawPolygon(exitArea.points);
    	graphics.endFill();

	}.bind(this));

}

aventura.ExitAreaManager.prototype.verifyIfPlayerIsInExitArea = function(player) {

	this.exitAreas.every(function(exitArea) {

		if (exitArea.polygon.contains(player.body.x, player.body.y)) {
			this.engine.goToRoom(exitArea.goTo.roomName, exitArea.goTo.playerStart);
			return false;
		}
		return true;

	}.bind(this));

}