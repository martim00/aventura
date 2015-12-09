goog.provide('aventura.app.AdventureGame');

goog.require('aventura.app.GameRoom');
goog.require('aventura.app.Character');

var path = require('path');

aventura.app.AdventureGame = function(name, folder, width, height) {
	this.name = name;
	this.folder = folder;
	this.width = width;
	this.height = height;
	this.rooms = [];
	this.characters = [];
	this.walkableAreas = [];
	this.currentRoom = undefined;
	this.currentCharacter = undefined;
}

aventura.app.AdventureGame.prototype.createNewRoom = function(roomName) {
	var room = new aventura.app.GameRoom(roomName, this.width, this.height);
	this.rooms.push(room);
	this.currentRoom = room;
}

aventura.app.AdventureGame.prototype.createNewCharacter = function(name) {
	this.currentCharacter = new aventura.app.Character(name);
	this.characters.push(this.currentCharacter);
}

aventura.app.AdventureGame.prototype.createWalkableArea = function(polygon) {
	this.currentRoom.createWalkableArea(polygon);
}

aventura.app.AdventureGame.prototype.getRoomByName = function(roomName) {
	for (var i = 0; i < this.rooms.length; i++) {
		if (this.rooms[i].name == roomName)
			return this.rooms[i];
	}

	return null;
}

aventura.app.AdventureGame.prototype.setCurrentRoom = function(room) {
	this.currentRoom = room;
}

aventura.app.AdventureGame.prototype.isCurrentRoom = function(roomName) {
	return this.currentRoom.name === roomName;
}

aventura.app.AdventureGame.prototype.setCurrentCharacter = function(character) {
	this.currentCharacter = character;
}

aventura.app.AdventureGame.prototype.getCurrentCharacter = function(character) {
	return this.currentCharacter;
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
aventura.app.AdventureGame.prototype.setCharacterSprite = function(name, filename, width, height, rawData, fn) {
	DbC.require(this.currentCharacter != undefined, "should have a current character to set its sprite");

    this.currentCharacter.setSprite(new aventura.app.SpriteSheet(name, filename, width, height));
	this.copyFileToGameFolder(filename, rawData, fn);
}

aventura.app.AdventureGame.prototype.getCurrentRoomBg = function() {
	if (!this.currentRoom || this.currentRoom.getBg() == undefined)
		return "";

	return this.getAbsPath(this.currentRoom.getBg());
}

aventura.app.AdventureGame.prototype.getCurrentCharacterSprite = function() {
	if (!this.currentCharacter || this.currentCharacter.getSprite() == undefined)
		return "";

	return this.getAbsPath(this.currentCharacter.getSprite().getPath());
}

aventura.app.AdventureGame.prototype.getAbsPath = function(relativePath) {
    return this.folder + "/" + relativePath;
}

aventura.app.AdventureGame.prototype.copyFileToGameFolder = 
	function(targetFileName, rawData, fn) {

    writeBinaryFile(this.getAbsPath(targetFileName), rawData, fn);
}

aventura.app.AdventureGame.prototype.save = function() {
    writeTextFile(this.getAbsPath("game.json"), this.getGameAsJson(), function() {

    });
	this.copyResourceToGameFolder("ns.js");
	this.copyResourceToGameFolder("async.js");
	this.copyResourceToGameFolder("lazy_loader.js");
	this.copyResourceToGameFolder("phaser.min.js");
	this.copyResourceToGameFolder("game.js");
	this.copyResourceToGameFolder("player.js");
	this.copyResourceToGameFolder("clickable_area_manager.js");
	this.copyResourceToGameFolder("engine.js");
	this.copyResourceToGameFolder("exit_area_manager.js");
	this.copyResourceToGameFolder("inventory.js");
	this.copyResourceToGameFolder("load.js");
	this.copyResourceToGameFolder("menu.js");
	this.copyResourceToGameFolder("room.js");
	this.copyResourceToGameFolder("walkable_area_manager.js");
	this.copyResourceToGameFolder("index.html");
}

aventura.app.AdventureGame.prototype.copyResourceToGameFolder = function(filename) {
	//var nwDir = path.dirname(process.execPath);
	//var cwd = process.cwd();
	// TODO: get the application folder 
	var APP_FOLDER = "C:/users/aniceto/workspace/aventura/desktop/js/app/game-template";
    var gameTemplateFolder = path.resolve(APP_FOLDER, filename);

    copyFile(gameTemplateFolder, this.getAbsPath(filename), function(err) {
    	if (err)
    		console.log("fail to copy " + filename);
    });
}

aventura.app.AdventureGame.prototype.getGameAsJson = function() {
	var json = {};
	json.resources = [];

	json.rooms = {};
	this.rooms.forEach(function(room) {

		room.serialize(json);

	});

	json.players = [];
	this.characters.forEach(function(character) {
		json.players.push({
			"name" : character.getName(), 
			"spritesheet" : character.hasSprite() ? character.getSprite().getName() : "",
			"startRoom" : "room1" // TODO: allow to configure in gui
		});

		if (character.hasSprite()) {

			json.resources.push({
				"name" : character.getSprite().getName(), 
				"path" : character.getSprite().getPath(), 
				"type" : "spritesheet",
				"width" : character.getSprite().getWidth(),
				"height" : character.getSprite().getHeight(),
			});

		}

	});
	return JSON.stringify(json, null, "\t");
}


