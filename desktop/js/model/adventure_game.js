ns.provide('aventura.app.AdventureGame');

/*goog.provide('aventura.app.AdventureGame');

goog.require('aventura.app.GameRoom');
goog.require('aventura.app.Character');*/

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
	this.items = [];
	this.initialRoom = undefined;
}

aventura.app.AdventureGame.prototype.getItems = function() {
	return this.items;
}

aventura.app.AdventureGame.prototype.getCharacters = function() {
	return this.characters;
}

aventura.app.AdventureGame.prototype.getRooms = function() {
	return this.rooms;
}

aventura.app.AdventureGame.prototype.createNewItem = function(name, label) {
	this.items.push(
		new aventura.app.InventoryItem(name, label, true, null));
}

aventura.app.AdventureGame.prototype.createNewRoom = function(roomName) {
	var room = new aventura.app.GameRoom(roomName, this.width, this.height);
	this.rooms.push(room);
	this.currentRoom = room;
	if (this.rooms.length == 1)
		this.setInitialRoom(room);
}

aventura.app.AdventureGame.prototype.createNewCharacter = function(name) {
	this.currentCharacter = new aventura.app.Character(name);
	this.characters.push(this.currentCharacter);
}

aventura.app.AdventureGame.prototype.createWalkableArea = function(points) {
	this.currentRoom.createWalkableArea(points);
}

aventura.app.AdventureGame.prototype.setInitialRoom = function(room) {
	this.initialRoom = room;
}

aventura.app.AdventureGame.prototype.getInitialRoom = function() {
	return this.initialRoom;
}

aventura.app.AdventureGame.prototype.getRoomByName = function(roomName) {
	for (var i = 0; i < this.rooms.length; i++) {
		if (this.rooms[i].name == roomName)
			return this.rooms[i];
	}

	return null;
}

aventura.app.AdventureGame.prototype.hasRoom = function(room) {
	return this.getRoomByName(room) != null;
}

aventura.app.AdventureGame.prototype.setCurrentRoom = function(room) {
	this.currentRoom = room;
}

aventura.app.AdventureGame.prototype.getCurrentRoom = function() {
	return this.currentRoom;
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

aventura.app.AdventureGame.prototype.getCharacterByName = function(characterName) {
	for (var i = 0; i < this.characters.length; i++) {
		if (this.characters[i].getName() == characterName)
			return this.characters[i];
	}

	return null;
}

aventura.app.AdventureGame.prototype.getGameIndex = function() {
	return this.getAbsPath("index.html");
}

aventura.app.AdventureGame.prototype.setCurrentRoomBg = 
	function(filename, rawData) {

	DbC.require(this.currentRoom != undefined, "should have a current room to set its bg");

    this.currentRoom.setBg(filename);
	this.copyFileToGameFolder(filename, rawData);
}

/*
*	Sets the current character sprite
*/
aventura.app.AdventureGame.prototype.setCharacterSprite = function(name, filename, width, height, rawData) {
	DbC.require(this.currentCharacter != undefined, "should have a current character to set its sprite");

    this.currentCharacter.setSprite(new aventura.app.SpriteSheet(name, filename, width, height));
	this.copyFileToGameFolder(filename, rawData);
}

aventura.app.AdventureGame.prototype.setItemSprite = function(item, filename, width, height, rawData) {
	DbC.require(item.getName());
    item.setSprite(new aventura.app.SpriteSheet(item.getName(), filename, width, height));
	this.copyFileToGameFolder(filename, rawData);
}

aventura.app.AdventureGame.prototype.getCurrentRoom = function() {
	return this.currentRoom;
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

aventura.app.AdventureGame.prototype.getItemSpritePath = function(item) {
	if (!item || item.getSprite() == undefined)
		return "";

	return this.getAbsPath(item.getSprite().getPath());
}

aventura.app.AdventureGame.prototype.getAbsPath = function(relativePath) {
    return this.folder + "/" + relativePath;
}

aventura.app.AdventureGame.prototype.copyFileToGameFolder = 
	function(targetFileName, rawData) {

    writeBinaryFile(this.getAbsPath(targetFileName), rawData);
}

aventura.app.AdventureGame.prototype.setFolder = function(folder) {
	this.folder = folder;
}

aventura.app.AdventureGame.prototype.getFolder = function() {
	return this.folder;
}

aventura.app.AdventureGame.prototype.isPristine = function() {
	return this.folder == "";
}

aventura.app.AdventureGame.prototype.saveAs = function(folder) {
	this.setFolder(folder);
	this.save();
}	

aventura.app.AdventureGame.prototype.save = function() {

	if (!this.folder) 
		throw new Error("the game folder is unset");

    writeTextFile(this.getAbsPath("game.json"), this.getGameAsJson());

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
	var nwDir = path.dirname(process.execPath);
	var cwd = process.cwd();
	var APP_FOLDER = cwd + "/js/game-template";
	// todo: GET THE APPLICATION FOLDER 

	// var APP_FOLDER = "C:/users/aniceto/workspace/aventura/desktop/js/game-template";
    var gameTemplateFolder = path.resolve(APP_FOLDER, filename);
	
	copyFileSync(gameTemplateFolder, this.getAbsPath(filename));
    /*copyFile(gameTemplateFolder, this.getAbsPath(filename), function(err) {
    	if (err)
    		console.log("fail to copy " + filename);
    });*/
}

aventura.app.AdventureGame.prototype.getGameAsJson = function() {
	var json = {};
	json.width = this.width;
	json.height = this.height;
	json.resources = [];

	json.rooms = {};
	this.rooms.forEach(function(room) {
		room.serialize(json);
	});

	json.initialRoom = this.initialRoom ? this.initialRoom.getName() : "";

	json.players = [];
	this.characters.forEach(function(character) {
		character.serialize(json);
	});

	json.items = [];
	this.items.forEach(function(item) {
		item.serialize(json);
	});

	return JSON.stringify(json, null, "\t");
}

aventura.app.AdventureGame.prototype.load = function(jsonAsString) {

	var json = JSON.parse(jsonAsString);
	this.width = json.width;
	this.height = json.height;

	for (var roomName in json.rooms) {
  		if (json.rooms.hasOwnProperty(roomName)) {
  			var gameRoom = aventura.app.GameRoom.loadFrom(json, roomName);
			this.rooms.push(gameRoom); 
		}
  	}

  	this.currentRoom = this.rooms.length > 0 ? this.rooms[0]: null;

  	if (this.rooms.length > 0) {
  		if (!json.initialRoom || !this.hasRoom(json.initialRoom))
  			throw new Exception("cant load the json: the initialRoom points to an invalid room");
  	}

  	this.initialRoom = this.rooms.length > 0 ? this.getRoomByName(json.initialRoom): null;

  	if (json.players) {
  		json.players.forEach(function(playerJson) {
			var character = aventura.app.Character.loadFrom(json, playerJson);
			this.characters.push(character); 
  		}.bind(this));
  	}

  	if (json.items) {
  		json.items.forEach(function(itemJson) {
  			var item = aventura.app.InventoryItem.loadFrom(json, itemJson);
  			this.items.push(item);
  		}.bind(this));
  	}
}

aventura.app.AdventureGame.prototype.open = function(folder, fn) {
	this.setFolder(folder);

    var gameFile = path.resolve(folder, "game.json");
    try {
    	var content = readFile(gameFile);

	} catch(e) {
		throw new Error("the folder should have a game.json file");
	}
    this.load(content);

	/*readFile(gameFile, function(err, data) {
		if (err)
			fn(new Error("the folder should have a game.json file"));

		this.load(data);
	}.bind(this));*/
}


