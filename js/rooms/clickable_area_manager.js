goog.provide('aventura.ClickableAreaManager');

aventura.ClickableAreaManager = function(game, engine) {
	this.game = game;
	this.engine = engine;
};

aventura.ClickableAreaManager.prototype.init = function(roomData) {
    this.clickableAreas = [];

    if (!roomData.clickableAreas)
    	return;

    roomData.clickableAreas.forEach(function(clickableData) {
        
        var clickableArea = new Phaser.Polygon();
    	var polygonArray = [];
        this.clickableAreas.push({"polygon" : clickableArea, "actions" : clickableData.actions});
        clickableData.polygon.forEach(function(point) {
            polygonArray.push(new Phaser.Point(point[0], point[1]));
        });
        clickableArea.setTo(polygonArray);
        var graphics = this.game.add.graphics(0, 0);

        graphics.alpha = debug ? 0.5 : 0;

        graphics.beginFill(0x00FF00);
        graphics.drawPolygon(clickableArea.points);
        graphics.endFill();
    }.bind(this));

}

aventura.ClickableAreaManager.prototype.doClickableActions = function(clickableArea) {

	clickableArea.actions.forEach(function(action) {
		var methodName = action.name;
		var params = action.params;
		var sliced = Array.prototype.slice.call(params, 1);
		console.log(sliced);
		var enableIf = action.enableIf;
		var result = eval(enableIf);
		console.log(result);
		if (!enableIf || (enableIf && eval(result)))
			this.engine[methodName].apply(this.engine, params);
	}.bind(this));
}

aventura.ClickableAreaManager.prototype.handleMouse = function(pointer) {

	for (var i = 0; i < this.clickableAreas.length; i++) {
		var clickableArea = this.clickableAreas[i];
     	if (clickableArea.polygon.contains(pointer.x, pointer.y)) {
     		this.doClickableActions(clickableArea);
            return false;
        }        
	}
	return true;

}
