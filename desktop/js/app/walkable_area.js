goog.provide("aventura.app.WalkableArea");

aventura.app.WalkableArea = function(polygon) {
	this.polygon = polygon; //fabric.Polygon
}

aventura.app.WalkableArea.prototype.init = function() {
}

aventura.app.WalkableArea.prototype.getPoints = function() {
	return this.polygon.get("points");
}