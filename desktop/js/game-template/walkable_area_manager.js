ns.provide('aventura.WalkableAreaManager');


aventura.WalkableAreaManager = function(game, engine) {
	this.game = game;
	this.engine = engine;
	this.walkableAreas = [];
};

aventura.WalkableAreaManager.prototype.init = function(roomData) {

	if (!roomData.walkableAreas)
		return;

	roomData.walkableAreas.forEach(function(walkable) {

		var walkableArea = new Phaser.Polygon();
		this.walkableAreas.push(walkableArea);

		var polygonArray = [];
		walkable.forEach(function(point) {
			polygonArray.push(new Phaser.Point(point['x'], point['y']));
		});
		
		walkableArea.setTo(polygonArray);

	    graphics = this.game.add.graphics(0, 0);

	    graphics.alpha = debug ? 0.5 : 0;	
	    
	    graphics.beginFill(0xFF33ff);
	    graphics.drawPolygon(walkableArea.points);
	    graphics.endFill();	
	    
	}.bind(this));
    
}

aventura.WalkableAreaManager.prototype.contains = function(x, y) {
	for (var i = 0; i < this.walkableAreas.length; i++) {
		if (this.walkableAreas[i].contains(x, y))
			return true;
	}
	return false;
}