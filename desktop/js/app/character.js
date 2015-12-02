goog.provide('aventura.app.Character');

aventura.app.Character = function(name) {
	this.name = name;
	this.spriteSheet = null;
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