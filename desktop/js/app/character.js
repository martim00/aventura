goog.provide('aventura.app.Character');

aventura.app.Character = function(name) {
	this.name = name;
	this.spritePath = "";
}

aventura.app.Character.prototype.setSprite = function(spritePath) {
	this.spritePath = spritePath;
}