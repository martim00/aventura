goog.provide('aventura.Inventory');

aventura.Inventory = function(game, engine) {
    this.game = game;
    this.engine = engine;
}


aventura.Inventory.prototype.X = 150;
aventura.Inventory.prototype.Y = 10;
aventura.Inventory.prototype.WIDTH = 450;
aventura.Inventory.prototype.HEIGHT = 70;
    
aventura.Inventory.prototype.init = function(roomData) {
    this.inventoryWidget = this.game.add.graphics(0, 0);

    graphics.alpha = debug ? 0.5 : 0;

    graphics.beginFill(0x00FF00);
    graphics.drawPolygon(new Phaser.Polygon([new Phaser.Point(this.X, this.Y), new Phaser.Point(this.x + this.WIDTH, this.Y), new Phaser.Point(this.x + this.WIDTH, this.Y + this.HEIGHT), new Phaser.Point(this.X, this.Y + this.HEIGHT)]));
    graphics.endFill();
}