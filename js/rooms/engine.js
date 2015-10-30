goog.provide('aventura.Engine');



aventura.Engine = function(game) {
	this.game = game;
    this.walkableAreaManager = new aventura.WalkableAreaManager(game, this);
    this.clickableAreaManager = new aventura.ClickableAreaManager(game, this);
    this.exitAreaManager = new aventura.ExitAreaManager(game, this);
};

aventura.Engine.prototype.initRoom = function(roomName, playerStart) {
	this.actualRoomName = roomName;
	this.playerStart = playerStart;
    this.mouseHandlers = [];

	this.data = JSON.parse(this.game.cache.getText('rooms'));

	var actualRoomData = this.data.rooms[this.actualRoomName];

	this.configureBackground(actualRoomData);

    this.createWalkableArea(actualRoomData);

    this.createClickableAreas(actualRoomData);
    this.configurePlayerAt(this.playerStart[0], this.playerStart[1]);

    this.createExitRoom(actualRoomData);

    game.input.onDown.add(this.callMouseHandlers, this);
}

aventura.Engine.prototype.showTextAtCenter = function(text) {
    var style = { font: "12px Arial", fill: "#000000", align: "center" };

    var textMarginBottom = 10;

    var text = this.game.add.text(game.world.centerX, (game.world.centerY + game.height / 2) - textMarginBottom, text, style);

    text.anchor.set(0.5);

    setTimeout(function() {
        text.destroy();

    }.bind(this), 1000);
}

aventura.Engine.prototype.showTextAt = function(x, y, text) {

    var style = { font: "12px Arial", fill: "#000000", align: "center" };

    var text = this.game.add.text(x, y, text, style);

    text.anchor.set(0.5);

    setTimeout(function() {
        text.destroy();

    }.bind(this), 1000);
}

aventura.Engine.prototype.configureBackground = function(roomData) {
    //  A simple background for our game
    this.game.add.sprite(0, 0, roomData.bg);
}

aventura.Engine.prototype.configurePlayerAt = function(x, y) {
	this.player = new Player(this.game, x, y, this.walkableAreaManager, this.exitAreaManager);
    this.mouseHandlers.push(this.player);
}

aventura.Engine.prototype.createClickableAreas = function(roomData) {
    this.clickableAreaManager.init(roomData);
    this.mouseHandlers.push(this.clickableAreaManager);
}

aventura.Engine.prototype.createExitRoom = function(roomData) {
	this.exitAreaManager.init(roomData);
}

aventura.Engine.prototype.createWalkableArea = function(roomData) {
    this.walkableAreaManager.init(roomData);
}

aventura.Engine.prototype.callMouseHandlers = function() {
    this.mouseHandlers.every(function(mouseHandler) {

        return mouseHandler.handleMouse(game.input.mousePointer);

    });

}
