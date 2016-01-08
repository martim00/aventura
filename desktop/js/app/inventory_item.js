ns.provide("aventura.app.InventoryItem");

aventura.app.InventoryItem = function(name, label, visible, position) {
	this.name = name;
	this.label = label;
	this.visible = visible;
	this.position = position;
	this.sprite = null;
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

aventura.app.InventoryItem.prototype.setSprite = function(sprite) {
	this.sprite = sprite;
}

aventura.app.InventoryItem.prototype.getSprite = function() {
	return this.sprite;
}

aventura.app.InventoryItem.loadFrom = function(gameJson, itemJson) {
	var item = new aventura.app.InventoryItem(itemJson.name, 
		itemJson.label, itemJson.visible, itemJson.position);

	gameJson.resources.forEach(function(resource) {
		if (resource.name == itemJson.image) {
			item.setSprite(new aventura.app.SpriteSheet(itemJson.image, 
				resource.path, resource.width, resource.height));
		}
	});

	return item;
    
}
