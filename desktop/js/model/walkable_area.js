ns.provide("aventura.app.WalkableArea");

aventura.app.WalkableArea = function(points) {
	this.points = points; 
}

aventura.app.WalkableArea.prototype.getPoints = function() {
	return this.points;
}