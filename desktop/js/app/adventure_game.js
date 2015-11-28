goog.provide('aventura.app.AdventureGame');

goog.require('aventura.app.GameRoom');
goog.require('aventura.app.Character');

aventura.app.AdventureGame = function(name, folder, width, height) {
	this.name = name;
	this.folder = folder;
	this.width = width;
	this.height = height;
	this.rooms = [];
	this.characters = [];
	this.currentRoom = undefined;
	this.currentCharacter = undefined;
}

aventura.app.AdventureGame.prototype.createNewRoom = function(roomName) {
	var room = new aventura.app.GameRoom(roomName);
	this.rooms.push(room);
	this.currentRoom = room;
}

aventura.app.AdventureGame.prototype.createNewCharacter = function(name) {
	this.characters.push(new aventura.app.Character(name));
}

aventura.app.AdventureGame.prototype.getRoomByName = function(roomName) {
	for (var i = 0; i < this.rooms.length; i++) {
		if (this.rooms[i].name == roomName)
			return this.rooms[i];
	}

	return null;
}

aventura.app.AdventureGame.prototype.setCurrentRoom = function(roomName) {
	this.currentRoom = this.getRoomByName(roomName);
}

aventura.app.AdventureGame.prototype.isCurrentRoom = function(roomName) {
	return this.currentRoom.name === roomName;
}

aventura.app.AdventureGame.prototype.setCurrentCharacter = function(character) {
	this.currentCharacter = character;
}

aventura.app.AdventureGame.prototype.isCurrentCharacter = function(character) {
	return this.currentCharacter === character;
}

aventura.app.AdventureGame.prototype.setCurrentRoomBg = 
	function(filename, rawData, fn) {

	DbC.require(this.currentRoom != undefined, "should have a current room to set its bg");

    this.currentRoom.setBg(filename);
	this.copyFileToGameFolder(filename, rawData, fn);
}

/*
*	Sets the current character sprite
*/
aventura.app.AdventureGame.prototype.setCharacterSprite = 
	function(filename, rawData, fn) {

	DbC.require(this.currentCharacter != undefined, "should have a current character to set its sprite");

    this.currentCharacter.setSprite(filename);
	this.copyFileToGameFolder(filename, rawData, fn);
}

aventura.app.AdventureGame.prototype.getCurrentRoomBg = function() {
	if (!this.currentRoom || this.currentRoom.getBg() == undefined)
		return "";

	return this.getAbsPath(this.currentRoom.getBg());
}

aventura.app.AdventureGame.prototype.getAbsPath = function(relativePath) {
    return this.folder + "/" + relativePath;
}

aventura.app.AdventureGame.prototype.copyFileToGameFolder = 
	function(targetFileName, rawData, fn) {

    writeToFile(this.getAbsPath(targetFileName), rawData, fn);
}



