goog.require('aventura.ClickableAreaManager');
goog.require('aventura.WalkableAreaManager');
goog.require('aventura.Engine');

debug = true;
var Room = function(game) {
    this.engine = new aventura.Engine(game);
};
  

Room.prototype.preload = function() {
}

Room.prototype.init = function(roomName, playerStart) {
	this.roomName = roomName;
	this.playerStart = playerStart;
}

Room.prototype.create = function() {

	initGame();
    this.engine.initRoom(this.roomName, this.playerStart);
}

function initGame() {
    cursors = game.input.keyboard.createCursorKeys();

	 //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.Arcade);
}


Room.prototype.update = function() {
	//  Collide the player and the stars with the platforms
    /*game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);*/

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

  //  console.log("scale : " + player.scale);


}



