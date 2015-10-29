goog.provide('aventura.ClickableAreaManager');

aventura.ClickableAreaManager = function(game, engine) {
	this.game = game;
	this.engine = engine;
};

aventura.ClickableAreaManager.prototype.init = function(roomData) {
    this.clickableAreas = [];

    var polygonArray = [];

    if (!roomData.clickableAreas)
    	return;

    roomData.clickableAreas.forEach(function(clickableData) {
        
        clickableArea = new Phaser.Polygon();
        this.clickableAreas.push({"polygon" : clickableArea, "text" : clickableData.text});
        clickableData.polygon.forEach(function(point) {
            polygonArray.push(new Phaser.Point(point[0], point[1]));
        });
        clickableArea.setTo(polygonArray);
        graphics = this.game.add.graphics(0, 0);

        graphics.alpha = debug ? 0.5 : 0;

        graphics.beginFill(0x00FF00);
        graphics.drawPolygon(clickableArea.points);
        graphics.endFill();
    }.bind(this));

}

aventura.ClickableAreaManager.prototype.handleMouse = function(pointer) {

	for (var i = 0; i < this.clickableAreas.length; i++) {
		var clickableArea = this.clickableAreas[i];
     	if (clickableArea.polygon.contains(pointer.x, pointer.y)) {
            this.engine.showTextAtCenter(clickableArea.text);
            return false;
        }        
	}
	return true;

}
