ns.provide("aventura.app.ClickableArea");

aventura.app.ClickableArea = function(points) {
	this.points = points; 
}

aventura.app.ClickableArea.prototype.getPoints = function() {
	return this.points;
}