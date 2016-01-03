ns.provide('aventura.app.Character');

aventura.app.Character = function(name) {
	this.name = name;
	this.spriteSheet = null;
	this.startRoom = null;
}

aventura.app.Character.prototype.setSprite = function(spriteSheet) {
	this.spriteSheet = spriteSheet;
}

aventura.app.Character.prototype.getSprite = function() {
	return this.spriteSheet;
}

aventura.app.Character.prototype.getName = function() {
	return this.name;
}

aventura.app.Character.prototype.hasSprite = function() {
	return this.spriteSheet != null;
}

aventura.app.Character.prototype.getStartRoom = function() {
	return this.startRoom;
}

aventura.app.Character.prototype.setStartRoom = function(room) {
	this.startRoom = room;
}

aventura.app.Character.prototype.hasStartRoom = function() {
	return this.startRoom != null;
}

aventura.app.Character.prototype.serialize = function(json) {

	if (!this.hasStartRoom())
		console.log("You are saving a character without start room. This will fail to start him");

	var room = this.getStartRoom();

	json.players.push({
		"name" : this.getName(), 
		"spritesheet" : this.hasSprite() ? this.getSprite().getName() : "",
		"startRoom" : this.hasStartRoom() ? this.getStartRoom().getName() : ""
	});

	if (this.hasSprite()) {

		json.resources.push({
			"name" : this.getSprite().getName(), 
			"path" : this.getSprite().getPath(), 
			"type" : "spritesheet",
			"width" : this.getSprite().getWidth(),
			"height" : this.getSprite().getHeight(),
		});

	}
}

aventura.app.Character.loadFrom = function(json, characterJson) {

	var character = new aventura.app.Character(characterJson.name);

	json.resources.forEach(function(resource) {
		if (resource.name == characterJson.spritesheet) {
			character.setSprite(new aventura.app.SpriteSheet(characterJson.spritesheet, 
				resource.path, resource.width, resource.height));
		}
	});
    
	return character;

}
