goog.provide('aventura.Inventory');

aventura.Inventory = function(game, engine) {
    this.game = game;
    this.engine = engine;

	this.gameItems = [];
    this.loadItems();

    this.x = 100;
    this.y = 10;
    this.width = 500;
    this.height = 50;
}


aventura.Inventory.prototype.init = function(roomData) {

	this.inventoryItems = [];

    this.inventoryWidget = this.game.add.graphics(0, 0);

    graphics.alpha = debug ? 0.5 : 0;

    graphics.beginFill(0x00FF28);
    graphics.drawPolygon(new Phaser.Polygon([new Phaser.Point(this.x, this.y)
    	, new Phaser.Point(this.x + this.width, this.y)
    	, new Phaser.Point(this.x + this.width, this.y + this.height)
    	, new Phaser.Point(this.x, this.y + this.height)]));
    graphics.endFill();

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

aventura.Inventory.prototype.putItem = function(itemName) {
	this.inventoryItems.push(this.getItemByName(itemName));
}
