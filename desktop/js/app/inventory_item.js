ns.provide("aventura.app.InventoryItem");

aventura.app.InventoryItem = function(name, label, visible, position, image) {
	this.name = name;
	this.label = label;
	this.visible = visible;
	this.position = position;
	this.image = image;
}

aventura.app.InventoryItem.prototype.getName = function() {
	return this.name;
}

aventura.app.InventoryItem.prototype.getLabel = function() {
	return this.label;
}

aventura.app.InventoryItem.prototype.isVisible = function() {
	return this.visible;
}

aventura.app.InventoryItem.prototype.getPosition = function() {
	return this.position;
}

aventura.app.InventoryItem.prototype.getImage = function() {
	return this.image;
}

aventura.app.InventoryItem.loadFrom = function(gameJson, itemJson) {
	return new aventura.app.InventoryItem(itemJson.name, 
		itemJson.label, itemJson.visible, itemJson.position, itemJson.image);
}
