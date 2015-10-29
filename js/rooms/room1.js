goog.require('aventura.ClickableAreaManager');

debug = true;
var room1 = function(game){
};
  

room1.prototype.preload = function() {
}

room1.prototype.init = function(roomName, playerStart) {
	this.roomName = roomName;
	this.playerStart = playerStart;
}

room1.prototype.create = function() {

	initGame();

	this.data = JSON.parse(game.cache.getText('rooms'));

	var actualRoomData = this.data.rooms[this.roomName];

	configureBackground(actualRoomData);

    this.mouseHandlers = [];

    this.createWalkableArea(actualRoomData);

    this.createClickableAreas(actualRoomData);
    this.configurePlayerAt(this.playerStart[0], this.playerStart[1]);

    createExitRoom(actualRoomData);

    game.input.onDown.add(this.callMouseHandlers, this);

}

function initGame() {
    cursors = game.input.keyboard.createCursorKeys();

	 //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.Arcade);
}

function configureBackground(roomData) {
    //  A simple background for our game
    game.add.sprite(0, 0, roomData.bg);

}

room1.prototype.configurePlayerAt = function(x, y) {
	player = new Player(game, x, y, this.walkableArea);
    this.mouseHandlers.push(player);
}

room1.prototype.createClickableAreas = function(roomData) {
    this.clickableAreaManager = new aventura.ClickableAreaManager(game, this);
    this.clickableAreaManager.init(roomData);
    this.mouseHandlers.push(this.clickableAreaManager);
}


function createExitRoom(roomData) {

	exitAreas = [];

	var polygonArray = [];
	roomData.exits.forEach(function(exitData) {
		
    	exitArea = new Phaser.Polygon();
    	exitAreas.push({"polygon" : exitArea, "goTo" : exitData.goTo});
		exitData.polygon.forEach(function(point) {
			polygonArray.push(new Phaser.Point(point[0], point[1]));
		});
		exitArea.setTo(polygonArray);
    	graphics = game.add.graphics(0, 0);

    	graphics.alpha = debug ? 0.5 : 0;

    	graphics.beginFill(0xF8333f);
    	graphics.drawPolygon(exitArea.points);
    	graphics.endFill();
	});
	


}

room1.prototype.createWalkableArea = function(roomData) {

    this.walkableArea = new Phaser.Polygon();

	var polygonArray = [];
	roomData.walkableArea.forEach(function(point) {
		polygonArray.push(new Phaser.Point(point[0], point[1]));
	});
	
	this.walkableArea.setTo(polygonArray);

    graphics = game.add.graphics(0, 0);

    graphics.alpha = debug ? 0.5 : 0;	
    

    graphics.beginFill(0xFF33ff);
    graphics.drawPolygon(this.walkableArea.points);
    graphics.endFill();

}


function playerCanWalk(direction, player) {
	if (direction == 1) // right
		return walkableArea.contains(player.body.x + player.width, player.body.y) ||
			walkableArea.contains(player.body.x + player.width, player.body.y + player.height);
	else if (direction == 2) //left
		return walkableArea.contains(player.body.x, player.body.y) ||
			walkableArea.contains(player.body.x, player.body.y + player.height);
	else if (direction == 3) // top
		return walkableArea.contains(player.body.x, player.body.y) ||
			walkableArea.contains(player.body.x + player.width, player.body.y);
	else if (direction == 4)
		return walkableArea.contains(player.body.x, player.body.y + player.height) ||
			walkableArea.contains(player.body.x + player.width, player.body.y + player.height);

	return false;
}

room1.prototype.update = function() {
	//  Collide the player and the stars with the platforms
    /*game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);*/

    //game.physics.arcade.overlap(player, walkable_areas, overlap_walkable, null, this);

    //if (!playerCanWalk) 
    	//return;

    //console.log(player.body.x);
    //console.log(player.body.y);

    //  Reset the players velocity (movement)
    /*player.body.velocity.x = 0;
    player.body.velocity.y = 0;    

    
    if (cursors.right.isDown && playerCanWalk(1, player))
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else if (cursors.left.isDown && playerCanWalk(2, player))
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.up.isDown && playerCanWalk(3, player))
    {
        player.body.velocity.y = -150;
        player.animations.play('up');
    }
    else if (cursors.down.isDown && playerCanWalk(4, player))
    {
        player.body.velocity.y = 150;
        player.animations.play('down');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 2;
    }*/

     //  only move when you click
    /*if (game.input.mousePointer.isDown)
    {
        //  400 is the speed it will move towards the mouse
        game.physics.arcade.moveToPointer(player, 400);

        //  if it's overlapping the mouse, don't move any more
        if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y))
        {
            player.body.velocity.setTo(0, 0);
        }
    }*/

    player.scale.set((player.body.y + player.height) / game.world.height, (player.body.y + player.height) / game.world.height);
  //  console.log("scale : " + player.scale);

    /*if (exitArea.contains(player.body.x, player.body.y))
    	game.state.start("room2");*/

    //this.callMouseHandlers();

    verifyIfPlayerIsInExitArea(player);

    //this.verifyClickAtClickableArea();
}

room1.prototype.callMouseHandlers = function() {
    //if (game.input.mousePointer.isDown) {
        this.mouseHandlers.every(function(mouseHandler) {

            return mouseHandler.handleMouse(game.input.mousePointer);

        });

    //}
}

room1.prototype.verifyClickAtClickableArea = function() {



}

room1.prototype.verifyClickAtClickableArea = function() {
    if (game.input.mousePointer.isDown) {
        this.clickableAreas.every(function(clickableArea) {
            if (clickableArea.polygon.contains(game.input.x, game.input.y)) {
                this.showTextAtCenter(clickableArea.text);
            }        
        }.bind(this));

    }
}

room1.prototype.showTextAtCenter = function(text) {
    var style = { font: "12px Arial", fill: "#000000", align: "center" };

    var textMarginBottom = 10;

    var text = game.add.text(game.world.centerX, (game.world.centerY + game.height / 2) - textMarginBottom, text, style);

    text.anchor.set(0.5);

    setTimeout(function() {
        text.destroy();

    }.bind(this), 1000);
}

room1.prototype.showTextAt = function(x, y, text) {
    var style = { font: "12px Arial", fill: "#000000", align: "center" };

    var text = game.add.text(x, y, text, style);

    text.anchor.set(0.5);

    setTimeout(function() {
        text.destroy();

    }.bind(this), 1000);
}

function verifyIfPlayerIsInExitArea(player) {

	exitAreas.every(function(exitArea) {
		if (exitArea.polygon.contains(player.body.x, player.body.y)) {
			game.state.start("room1", true, false, exitArea.goTo.roomName, exitArea.goTo.playerStart);
			return false;
		}
		return true;
	});

}

function overlap_walkable (player, walkable_area) {

	console.log("overlapping");
//	playerCanWalk = true;

}

