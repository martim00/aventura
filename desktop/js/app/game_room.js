goog.provide('aventura.app.GameRoom');

aventura.app.GameRoom = function(name) {
	this.name = name;
	this.bg;
}

aventura.app.GameRoom.prototype.setBg = function(bg) {
	this.bg = bg;
}

aventura.app.GameRoom.prototype.getBg = function() {
	return this.bg;
}