Player = function (game, x, y, walkableArea) {

	this.walkableArea = walkableArea;

    //  We call the Phaser.Sprite passing in the game reference
    //  We're giving it a random X/Y position here, just for the sake of this demo - you could also pass the x/y in the constructor
    Phaser.Sprite.call(this, game, x, y, 'hero');

    game.add.existing(this);

    // The player and its settings
    //player = game.add.sprite(x, y, 'hero');

    //player.pivot.x = player.width * .5;
	//player.pivot.y = player.height * .5;
    this.anchor.setTo(0.5);

    //  We need to enable physics on the player
    game.physics.arcade.enable(this, true);

    //  Player physics properties. Give the little guy a slight bounce.
    this.body.gravity.y = 0;
    this.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    this.animations.add('left', [10, 11, 12, 14], 10, true);
    this.animations.add('right', [5, 6, 8, 9], 10, true);
    this.animations.add('up', [15, 16, 18, 19], 10, true);
    this.animations.add('down', [0, 1, 3, 4], 10, true);

	this.isMoving = false;
    // move character on input down/tap
  	//game.input.onDown.add(this.moveCharacter, this);

	this.graphics = game.add.graphics(0, 0);

    this.graphics.alpha = debug ? 0.5 : 0;



};





Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.createDebugInfo = function() {

	this.graphics.clear();	

    var debugPolygon = new Phaser.Polygon();
    debugPolygon.setTo([new Phaser.Point(this.body.x, this.body.y), 
    	new Phaser.Point(this.body.x + this.width, this.body.y), 
    	new Phaser.Point(this.body.x + this.width, this.body.y + this.height), 
    	new Phaser.Point(this.body.x, this.body.y + this.height)]);

    this.graphics.beginFill(0xFF88ff);
    this.graphics.drawPolygon(debugPolygon.points);
    this.graphics.endFill();
}


Player.prototype.update = function() {
	if (this.isMoving) {
    	// play sprite at 12 frames per second
    	var anim = this.getAnimationByDirection();
    	console.log("animation: " + anim);
    	this.animations.play(anim, 12, true);
  	} 
  	else {
    	this.animations.stop();
  	}

  	if (!this.playerCanWalk2(this.moveDirection, this)) {
  		this.isMoving = false;
    	if (this.tween)
    		this.tween.stop();

  	}

  	//this.render();

  	this.createDebugInfo();



};

Player.prototype.render = function() {
	game.debug.bodyInfo(this, 32, 32);

    game.debug.body(this);
}

var LEFT = "LEFT";
var RIGHT = "RIGHT";
var TOP = "TOP";
var DOWN = "DOWN";
var LEFT_DOWN = "LEFT_DOWN";
var RIGHT_DOWN = "RIGHT_DOWN";
var LEFT_UP = "LEFT_UP";
var RIGHT_UP = "RIGHT_UP";
var STOPPED = "STOPPED";

Player.prototype.setMoveDirection = function(pointer) {

	if (pointer.x == this.body.x && pointer.y == this.body.y) {
		this.moveDirection = "STOPPED";
		return;
	}


	if (pointer.x == this.body.x) {
		if (pointer.y < this.body.y)
			this.moveDirection = UP;
		else 
			this.moveDirection = DOWN;
	} 
	else if (pointer.y == this.body.y) {

		if (pointer.x > this.body.x) 
			this.moveDirection = RIGHT;
		else 
			this.moveDirection = LEFT;
	}
	else if (pointer.x > this.body.x) {
		if (pointer.y < this.body.y)
			this.moveDirection = RIGHT_UP;
		else 
			this.moveDirection = RIGHT_DOWN;
	}
	else if (pointer.x < this.body.x) {
		if (pointer.y > this.body.y) 
			this.moveDirection = LEFT_DOWN;
		else 
			this.moveDirection = LEFT_UP;
	}
	console.log("moveDirection>: " + this.moveDirection);
}
Player.prototype.getAnimationByDirection = function() {
	if (this.moveDirection == LEFT || this.moveDirection == LEFT_DOWN || this.moveDirection == LEFT_UP)
		return "left";
	else if (this.moveDirection == RIGHT || this.moveDirection == RIGHT_DOWN || this.moveDirection == RIGHT_UP)
		return "right";
	else if (this.moveDirection == TOP)
		return "up";
	else if (this.moveDirection == DOWN)
		return "down";



}

Player.prototype.moveCharacter = function(pointer) {

	// the player is moving now!
  	this.isMoving = true;
  	this.setMoveDirection(pointer);

  	// 300 means 300 pixels per second. This is the speed the sprite will move at, regardless of the distance it has to travel.
  	var duration = (game.physics.arcade.distanceToPointer(this, pointer) / 300) * 1000;

  	// pointer.x and pointer.y are the input x and y values coming from the mouse click or tap.
  	this.tween = game.add.tween(this).to({ x: pointer.x, y: pointer.y }, duration, Phaser.Easing.Linear.None, true);

  	// once tween is completed, call moveCharacterComplete()
  	this.tween.onComplete.add(this.moveCharacterComplete, this);

  	//this.tween.onLoop.add(this.verifyIfCanWalk, this);
}

Player.prototype.playerCanWalk2 = function(direction, player) {

	var centerX = player.body.x + player.width / 2;
	var centerY = player.body.y + player.height / 2;

	if (direction == RIGHT) // right
		return this.walkableArea.contains(player.body.x + player.width, player.body.y + player.height / 2) &&
			this.walkableArea.contains(centerX, centerY);
	else if (direction == LEFT) //left
		return this.walkableArea.contains(player.body.x, player.body.y + player.height / 2) &&
			this.walkableArea.contains(centerX, centerY);
	else if (direction == TOP) // top
		return this.walkableArea.contains(player.body.x + player.width / 2, player.body.y) &&
			this.walkableArea.contains(centerX, centerY);
	else if (direction == DOWN)
		return this.walkableArea.contains(player.body.x + player.width / 2, player.body.y + player.height / 2) &&
			this.walkableArea.contains(centerX, centerY);
	else if (direction == RIGHT_UP)
		return this.walkableArea.contains(player.body.x + player.width, player.body.y) &&
			this.walkableArea.contains(centerX, centerY);
	else if (direction == RIGHT_DOWN)
		return this.walkableArea.contains(player.body.x + player.width, player.body.y + player.height) &&
			this.walkableArea.contains(centerX, centerY);
	else if (direction == LEFT_DOWN)
		return this.walkableArea.contains(player.body.x, player.body.y + player.height) &&
			this.walkableArea.contains(centerX, centerY);
	else if (direction == LEFT_UP)
		return this.walkableArea.contains(player.body.x, player.body.y) &&
			this.walkableArea.contains(centerX, centerY);

	return false;
}



Player.prototype.moveCharacterComplete = function() {
  	this.isMoving = false;
  	this.animations.stop();
}

Player.prototype.handleMouse = function(pointer) {
	this.moveCharacter(pointer);
	return true;
}
