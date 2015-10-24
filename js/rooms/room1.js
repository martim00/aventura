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

	configurePlayerAt(this.playerStart[0], this.playerStart[1]);

    createWalkableArea(actualRoomData);
    createExitRoom(actualRoomData);
}

function initGame() {
    cursors = game.input.keyboard.createCursorKeys();
}

function configureBackground(roomData) {
    //  A simple background for our game
    game.add.sprite(0, 0, roomData.bg);

}

function configurePlayerAt(x, y) {
	 //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.Arcade);


    // The player and its settings
    player = game.add.sprite(x, y, 'hero');

    //player.pivot.x = player.width * .5;
	//player.pivot.y = player.height * .5;
    player.anchor.setTo(0.5);

    //  We need to enable physics on the player
    game.physics.arcade.enable(player, true);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.gravity.y = 0;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [10, 11, 12, 14], 10, true);
    player.animations.add('right', [5, 6, 8, 9], 10, true);
    player.animations.add('up', [15, 16, 18, 19], 10, true);
    player.animations.add('down', [0, 1, 3, 4], 10, true);


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
	

    //  And then populate it via setTo, using any combination of values as above
    /*exitArea.setTo([ 
    	new Phaser.Point(671, 450)
    	, new Phaser.Point(671, 548)
    	, new Phaser.Point(500, 548)
    	, new Phaser.Point(500, 450)
     ]);*/


}

function createWalkableArea(roomData) {

    walkableArea = new Phaser.Polygon();

    //  And then populate it via setTo, using any combination of values as above
    /*walkableArea.setTo([ new Phaser.Point(0, 400)
    	, new Phaser.Point(25, 340)
    	, new Phaser.Point(40, 340)
    	, new Phaser.Point(70, 400)
    	, new Phaser.Point(671, 450)
    	, new Phaser.Point(671, 548)
    	, new Phaser.Point(0, 548)


     ]);*/
	var polygonArray = [];
	roomData.walkableArea.forEach(function(point) {
		polygonArray.push(new Phaser.Point(point[0], point[1]));
	});
	
	walkableArea.setTo(polygonArray);

    graphics = game.add.graphics(0, 0);

    graphics.alpha = debug ? 0.5 : 0;	
    

    graphics.beginFill(0xFF33ff);
    graphics.drawPolygon(walkableArea.points);
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

	/*if (poly.contains(player.body.x, player.body.y) 
    	&& poly.contains(player.body.x + player.width, player.body.y)
    	&& poly.contains(player.body.x + player.width, player.body.y + player.height)
    	&& poly.contains(player.body.x, player.body.y + player.height)
    	)
    	return true;*/
}

room1.prototype.update = function() {
	//  Collide the player and the stars with the platforms
    /*game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);*/

    //game.physics.arcade.overlap(player, walkable_areas, overlap_walkable, null, this);

    //if (!playerCanWalk) 
    	//return;

    console.log(player.body.x);
    console.log(player.body.y);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
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
    }

    player.scale.set((player.body.y + player.height) / game.world.height, (player.body.y + player.height) / game.world.height);
    console.log("scale : " + player.scale);

    /*if (exitArea.contains(player.body.x, player.body.y))
    	game.state.start("room2");*/
    verifyIfPlayerIsInExitArea(player);

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

