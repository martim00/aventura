goog.provide('aventura.app.AdventureGame');

aventura.app.AdventureGame = function(name) {
	this.name = name;
	this.rooms = [];

}

aventura.app.AdventureGame.prototype.createNewRoom = function(roomName) {
	this.rooms.push(roomName);
}
