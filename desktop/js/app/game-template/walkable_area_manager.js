ns.provide('aventura.WalkableAreaManager');


aventura.WalkableAreaManager = function(game, engine) {
	this.game = game;
	this.engine = engine;
};

aventura.WalkableAreaManager.prototype.init = function(roomData) {
	if (!roomData.walkableArea)
		return;
	
    this.walkableArea = new Phaser.Polygon();

	var polygonArray = [];
	roomData.walkableArea.forEach(function(point) {
		polygonArray.push(new Phaser.Point(point['x'], point['y']));
	});
	
	this.walkableArea.setTo(polygonArray);

    graphics = this.game.add.graphics(0, 0);

    graphics.alpha = debug ? 0.5 : 0;	
    
    graphics.beginFill(0xFF33ff);
    graphics.drawPolygon(this.walkableArea.points);
    graphics.endFill();
}

aventura.WalkableAreaManager.prototype.contains = function(x, y) {
	return this.walkableArea.contains(x, y);
}