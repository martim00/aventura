goog.provide('aventura.Inventory');

aventura.Inventory = function(game, engine) {
    this.game = game;
    this.engine = engine;

	this.gameItems = [];
    this.loadItems();

	this.inventoryItems = [];


    this.x = 100;
    this.y = 10;
    this.width = 500;
    this.height = 50;
}


aventura.Inventory.prototype.init = function() {

    this.inventoryWidget = this.game.add.graphics(0, 0);

    this.inventoryWidget.alpha = debug ? 0.5 : 0;

    this.inventoryWidget.beginFill(0x00FF28);
    this.inventoryWidget.drawPolygon(new Phaser.Polygon([new Phaser.Point(this.x, this.y)
    	, new Phaser.Point(this.x + this.width, this.y)
    	, new Phaser.Point(this.x + this.width, this.y + this.height)
    	, new Phaser.Point(this.x, this.y + this.height)]));
    this.inventoryWidget.endFill();

    this.renderItems();
}

aventura.Inventory.prototype.loadItems = function() {

	if (!this.engine.getData().items)
		return;

	this.engine.getData().items.forEach(function(item) {
		this.gameItems.push(item);
	}.bind(this));
}

aventura.Inventory.prototype.getItemByName = function(itemName) {
	for (var i = 0; i < this.gameItems.length; i++) {
		var item = this.gameItems[i];
		if (item.name == itemName)
			return item;
	}
	throw "cant find an item with name : " + itemName;
}

aventura.Inventory.prototype.getInventoryItem = function(itemName) {
	for (var i = 0; i < this.inventoryItems.length; i++) {
		var item = this.inventoryItems[i];
		if (item.name == itemName)
			return item;
	}
	return null;
}
aventura.Inventory.prototype.putItem = function(itemName) {
	if (this.getInventoryItem(itemName) != null)
		return;

	var item = this.getItemByName(itemName);
	this.inventoryItems.push(item);
	//this.drawItem(item);
	this.renderItems();
}

aventura.Inventory.prototype.renderItems = function() {
	for (var i = 0; i < this.inventoryItems.length; i++) {
		var item = this.inventoryItems[i];
		this.drawItemAt(item, i);
	}
}

aventura.Inventory.prototype.drawItemAt = function(item, index) {
	var xPosition = this.x + 64 * (index);
    this.game.add.sprite(xPosition, 0, item.image);
}
