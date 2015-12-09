//goog.provide('aventura.Engine');
ns.provide('aventura.Engine');



aventura.Engine = function(game) {
    this.game = game;    
    this.data = JSON.parse(this.game.cache.getText('gameData'));

    this.game.scale.setGameSize(600, 600);

    this.walkableAreaManager = new aventura.WalkableAreaManager(game, this);
    this.clickableAreaManager = new aventura.ClickableAreaManager(game, this);
    this.exitAreaManager = new aventura.ExitAreaManager(game, this);
    this.inventory = new aventura.Inventory(game, this);
};

aventura.Engine.prototype.getData = function() {
    return this.data;
}

aventura.Engine.prototype.initRoom = function(roomName, playerStart) {
    this.actualRoomName = roomName;
    this.playerStart = playerStart;
    this.mouseHandlers = [];

    var actualRoomData = this.data.rooms[this.actualRoomName];

    this.createGroups();

    this.configureBackground(actualRoomData);

    this.createWalkableArea(actualRoomData);
    this.createInventory();

    this.createClickableAreas(actualRoomData);

    this.configurePlayerAt(this.playerStart[0], this.playerStart[1]
        , this.data.players[0]); // for now only one player

    this.createExitRoom(actualRoomData);

    game.input.onDown.add(this.callMouseHandlers, this);
}

aventura.Engine.prototype.showTextAtCenter = function(txt) {
    var style = { font: "12px Arial", fill: "#000000", align: "center" };

    var textMarginBottom = 10;

    if (this.text) {
        this.text.destroy();
        clearTimeout(this.textTimeout);
    }
    
    this.text = this.game.add.text(game.world.centerX, (game.world.centerY + game.height / 2) - textMarginBottom, txt, style);

    this.text.anchor.set(0.5);

    this.textTimeout = setTimeout(function() {
        this.text.destroy();

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


aventura.Engine.prototype.putItemOnInventory = function(itemName) {
    this.inventory.putItem(itemName);
}

aventura.Engine.prototype.createGroups = function() {
    this.backLayer = this.game.add.group();
    this.frontLayer = this.game.add.group();
}

aventura.Engine.prototype.configureBackground = function(roomData) {
    var bg = this.backLayer.create(0, 0, roomData.bg.image);
    bg.width = roomData.bg.width;
    bg.height = roomData.bg.height;
}

aventura.Engine.prototype.configurePlayerAt = function(x, y, playerData) {
    this.player = new Player(this.game, playerData.spritesheet, this.frontLayer, x, y, this.walkableAreaManager, this.exitAreaManager);
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

aventura.Engine.prototype.createInventory = function() {
    this.inventory.init();
}

aventura.Engine.prototype.callMouseHandlers = function() {
    this.mouseHandlers.every(function(mouseHandler) {

        return mouseHandler.handleMouse(game.input.mousePointer);

    });
}

aventura.Engine.prototype.containsItem = function(itemName) {
    return this.inventory.getInventoryItem(itemName) != null;
}

aventura.Engine.prototype.goToRoom = function(roomName, playerStart) {
    this.game.state.start("room", true, false, roomName, playerStart, this);
}

aventura.Engine.prototype.loadAndStart = function() {

    var lazyLoader = new aventura.LazyLoader(this.game);

    async.each(this.data.resources, function(resource, callback) {
        if (resource.type === 'image') {
            lazyLoader.loadLazyImage(resource.name, resource.path, function() {
                callback();
            });
        }
        else if (resource.type === 'spritesheet') {
            lazyLoader.loadLazySpritesheet(resource.name, resource.path, resource.width, resource.height, function() {
                callback();
            });

        }

    }, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            this.game.state.start("room", true, false, "room1", [32, 500], this);
        }

    }.bind(this));
}


