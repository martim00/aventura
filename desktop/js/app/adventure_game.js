goog.provide('aventura.app.AdventureGame');

aventura.app.AdventureGame = function(name, folder) {
	this.name = name;
	this.folder = folder;
	this.rooms = [];

}

aventura.app.AdventureGame.prototype.createNewRoom = function(roomName) {
	this.rooms.push(roomName);
}
