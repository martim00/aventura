ns.provide("aventura.app.SpriteSheet");

aventura.app.SpriteSheet = function(name, path, width, height) {
	this.name = name;
	this.path = path;
	this.width = width;
	this.height = height;
}

aventura.app.SpriteSheet.prototype.init = function() {
}

aventura.app.SpriteSheet.prototype.getName = function() {
	return this.name;
}

aventura.app.SpriteSheet.prototype.getPath = function() {
	return this.path;
}

aventura.app.SpriteSheet.prototype.getWidth = function() {
	return this.width;
}

aventura.app.SpriteSheet.prototype.getHeight = function() {
	return this.height;
}

aventura.app.SpriteSheet.prototype.serialize = function(json) {
	DbC.requireNotNull(json.resources);
	json.resources.push({
		"name" : this.name,
		"path" : this.path,
		"width": this.width,
		"height": this.height,
		"type": "spritesheet"
	});
}



