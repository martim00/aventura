
var debug = true;

export class Inventory {
    constructor(engine) {
        this.engine = engine;
        this.gameItems = [];
        // this.loadItems();

        this.inventoryItems = [];

        this.x = 100;
        this.y = 10;
        this.width = 500;
        this.height = 50;

        this.availableSlots = this.width / this.height;

        this.itemSlotWidth = this.width / this.availableSlots;
        this.itemSlotHeight = this.height;
    }

    init(scene) {

        // this.inventoryWidget = scene.add.graphics(0, 0);

        // this.inventoryWidget.alpha = debug ? 0.5 : 0;

        // this.inventoryWidget.beginPath();
        // this.inventoryWidget.drawPolygon(new Phaser.Geom.Polygon([new Phaser.Geom.Point(this.x, this.y)
        //     , new Phaser.Geom.Point(this.x + this.width, this.y)
        //     , new Phaser.Geom.Point(this.x + this.width, this.y + this.height)
        //     , new Phaser.Geom.Point(this.x, this.y + this.height)]));
        // this.inventoryWidget.closePath();
        // this.inventoryWidget.strokePath();

        var polygon = new Phaser.Geom.Polygon([new Phaser.Geom.Point(this.x, this.y)
            , new Phaser.Geom.Point(this.x + this.width, this.y)
            , new Phaser.Geom.Point(this.x + this.width, this.y + this.height)
            , new Phaser.Geom.Point(this.x, this.y + this.height)]);

        var graphics = scene.add.graphics(0, 0);
        graphics.alpha = debug ? 0.5 : 0;	
        graphics.lineStyle(2, 0x00aa00);
        graphics.beginPath();
        graphics.moveTo(polygon.points[0].x, polygon.points[0].y);

        for (var i = 1; i < polygon.points.length; i++)
        {
            graphics.lineTo(polygon.points[i].x, polygon.points[i].y);
        }

        graphics.closePath();
        graphics.strokePath();

        this.renderItems();
    }

    loadItems() {

        if (!this.engine.getData().items)
            return;

        this.engine.getData().items.forEach(function(item) {
            this.gameItems.push(item);
        }.bind(this));
    }

    getItemByName(itemName) {
        for (var i = 0; i < this.gameItems.length; i++) {
            var item = this.gameItems[i];
            if (item.name == itemName)
                return item;
        }
        throw "cant find an item with name : " + itemName;
    }

    getInventoryItem(itemName) {
        for (var i = 0; i < this.inventoryItems.length; i++) {
            var item = this.inventoryItems[i];
            if (item.name == itemName)
                return item;
        }
        return null;
    }

    putItem(itemName) {
        if (this.getInventoryItem(itemName) != null)
            return;

        var item = this.getItemByName(itemName);
        this.inventoryItems.push(item);
        //this.drawItem(item);
        this.renderItems();
    }

    renderItems() {
        for (var i = 0; i < this.inventoryItems.length; i++) {
            var item = this.inventoryItems[i];
            this.drawItemAt(item, i);
        }
    }

    drawItemAt(item, index) {
        var xPosition = this.x + this.itemSlotWidth/2 + (this.itemSlotWidth * index);
        var yPosition = this.y + this.itemSlotHeight/2;
        this.engine.getCurrentScene().add.sprite(xPosition, yPosition, item.image);
    }


}