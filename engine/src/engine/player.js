
import 'phaser';

var LEFT = "LEFT";
var RIGHT = "RIGHT";
var TOP = "TOP";
var DOWN = "DOWN";
var LEFT_DOWN = "LEFT_DOWN";
var RIGHT_DOWN = "RIGHT_DOWN";
var LEFT_UP = "LEFT_UP";
var RIGHT_UP = "RIGHT_UP";
var STOPPED = "STOPPED";

var debug = true;

export class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(game, spritesheet, group, x, y, walkableAreaManager, exitAreaManager, engine) {
        super(game, x, y, 'player1Sprite');
        this.walkableAreaManager = walkableAreaManager;
        this.exitAreaManager = exitAreaManager;
        this.game = game;
        this.engine = engine;

        //  We call the Phaser.Sprite passing in the game reference
        //  We're giving it a random X/Y position here, just for the sake of this demo - you could also pass the x/y in the constructor
        // Phaser.Sprite.call(this, game, x, y, spritesheet);

        game.add.existing(this);
        game.physics.add.existing(this);
        // game.stage.add(this);
        group.add(this);
        // this.game.add.sprite(x, y, 'player1Sprite');

        // The player and its settings
        //player = game.add.sprite(x, y, 'hero');

        //player.pivot.x = player.width * .5;
        //player.pivot.y = player.height * .5;
        // this.anchor.setTo(0.5);

        //  We need to enable physics on the player
        // this.game.physics.arcade.enable(this, true);

        //  Player physics properties. Give the little guy a slight bounce.
        // this.body.gravity.y = 0;
        this.setGravity(0, 0);
        this.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        game.anims.create({
            key: 'stand', 
            frames: game.anims.generateFrameNumbers('player1Sprite', {start: 2, end: 2}),
            frameRate: 10,
            repeat: -1
        });

        game.anims.create({
            key: 'right', 
            frames: game.anims.generateFrameNumbers('player1Sprite', {start: 5, end: 9}),
            frameRate: 10,
            repeat: -1
        });

        game.anims.create({
            key: 'left', 
            frames: game.anims.generateFrameNumbers('player1Sprite', {start: 10, end: 14}),
            frameRate: 10,
            repeat: -1
        });

        game.anims.create({
            key: 'down', 
            frames: game.anims.generateFrameNumbers('player1Sprite', {start: 0, end: 4}),
            frameRate: 10,
            repeat: -1
        });

        game.anims.create({
            key: 'top', 
            frames: game.anims.generateFrameNumbers('player1Sprite', {start: 15, end: 19}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.play('stand', true);

        this.isMoving = false;
        // move character on input down/tap
        //game.input.onDown.add(this.moveCharacter, this);

        this.graphics = game.add.graphics(0, 0);

        this.graphics.alpha = debug ? 0.5 : 0;
    }

    log(msg) {
        if (debug) {
            console.log(msg);
        }
    }

    createDebugInfo() {

        this.graphics.clear();	

        var halfWidth = this.width / 2;
        var halfHeight = this.height / 2;

        var polygon = new Phaser.Geom.Polygon();
        polygon.setTo([new Phaser.Geom.Point(this.x - halfWidth, this.y + halfHeight), 
            new Phaser.Geom.Point(this.x + halfWidth, this.y + halfHeight), 
            new Phaser.Geom.Point(this.x + halfWidth, this.y - halfHeight), 
            new Phaser.Geom.Point(this.x - halfWidth, this.y - halfHeight)]);

        this.graphics.lineStyle(2, 0x00aa00);

        this.graphics.beginPath();

        this.graphics.moveTo(polygon.points[0].x, polygon.points[0].y);

        for (var i = 1; i < polygon.points.length; i++)
        {
            this.graphics.lineTo(polygon.points[i].x, polygon.points[i].y);
        }

        this.graphics.closePath();
        this.graphics.strokePath();
    }

    update() {
        // console.log('update player');
        // console.log(this.game.input.activePointer);
        // if (this.game.input.activePointer.isDown) {
            // this.game.input.activePointer.isDown = false;
            // this.moveCharacter(this.game.input.activePointer);
        // }

        if (this.isMoving) {
            // this.log('moving');
            // play sprite at 12 frames per second
            var anim = this.getAnimationByDirection();
            // this.log("animation: " + anim);
            this.anims.play(anim, true);
        } 
        else {
            // this.anims.stop();
            // this.log('not moving');
            this.anims.play('stand', true);
        }

        if (this.isMoving && !this.playerCanWalk(this.moveDirection, this)) {
            this.isMoving = false;
            this.stopTween();
        }

        this.updatePlayerScale();

        // return;
        this.exitAreaManager.verifyIfPlayerIsInExitArea(this);
        this.createDebugInfo();

    };

    updatePlayerScale() {
        var scale = (this.y + this.height) / this.engine.getConfig().height;
        this.scaleX = scale; 
        this.scaleY = scale; 
        // console.log('scale: ' + scale);
    }

    render() {
        this.log('render');
        game.debug.bodyInfo(this, 32, 32);
        game.debug.body(this);
    }

    setMoveDirection(pointer) {
        if (pointer.x == this.x && pointer.y == this.y) {
            this.moveDirection = "STOPPED";
            return;
        }

        if (pointer.x == this.x) {
            if (pointer.y < this.y)
                this.moveDirection = TOP;
            else 
                this.moveDirection = DOWN;
        } 
        else if (pointer.y == this.y) {

            if (pointer.x > this.x) 
                this.moveDirection = RIGHT;
            else 
                this.moveDirection = LEFT;
        }
        else if (pointer.x > this.x) {
            if (pointer.y < this.y)
                this.moveDirection = RIGHT_UP;
            else 
                this.moveDirection = RIGHT_DOWN;
        }
        else if (pointer.x < this.x) {
            if (pointer.y > this.y) 
                this.moveDirection = LEFT_DOWN;
            else 
                this.moveDirection = LEFT_UP;
        }
        this.log("moveDirection>: " + this.moveDirection);
    }

    getAnimationByDirection() {
        if (this.moveDirection == LEFT || this.moveDirection == LEFT_DOWN || this.moveDirection == LEFT_UP)
            return "left";
        else if (this.moveDirection == RIGHT || this.moveDirection == RIGHT_DOWN || this.moveDirection == RIGHT_UP)
            return "right";
        else if (this.moveDirection == TOP)
            return "top";
        else if (this.moveDirection == DOWN)
            return "down";

        else return 'stand';
    }

    stopTween() {
        if (this.tween) {
            this.tween.stop();
            this.tween = null;
        }
    }

    moveCharacter(pointer) {

        // the player is moving now!
        this.isMoving = true;
        this.setMoveDirection(pointer);
        

        var distanceX = this.x - pointer.x;
        this.log('distanceX: ' + distanceX);
        var distanceY = this.y - pointer.y;
        this.log('distanceY: ' + distanceY);
        var distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
        this.log('distance: ' + distance);
        var distance = Phaser.Math.Distance.Between(this.x, this.y, pointer.x, pointer.y);
        this.log('distance phaser: ' + distance);

        var speed = 100;
        var duration = (distance / speed) * 1000;
        this.log('duration: ' + duration);

        // 300 means 300 pixels per second. This is the speed the sprite will move at, regardless of the distance it has to travel.
        // var duration = (game.physics.arcade.distanceToPointer(this, pointer) / 300) * 1000;

        // pointer.x and pointer.y are the input x and y values coming from the mouse click or tap.
        this.stopTween();
        this.tween = this.game.add.tween({targets: this, x: pointer.x, y: pointer.y , duration, ease: 'Sine.easeInOut'});
        // this.tween = this.game.add.tween(this).to({ x: pointer.x, y: pointer.y }, duration, Phaser.Easing.Linear.None, true);

        // once tween is completed, call moveCharacterComplete()
        this.tween.setCallback('onComplete', this.moveCharacterComplete, [], this);

        //this.tween.onLoop.add(this.verifyIfCanWalk, this);
    }

    playerCanWalk(direction, player) {
        // return true;

        // var centerX = player.x + player.width / 2;
        // var centerY = player.y + player.height / 2;
        var centerX = player.x;
        var centerY = player.y;
        var middleX = player.width / 2;
        var middleY = player.height / 2;

        if (direction == RIGHT) // right
            return this.walkableAreaManager.contains(player.x + middleX, centerY);
                // this.walkableAreaManager.contains(centerX, centerY);
        else if (direction == LEFT) //left
            return this.walkableAreaManager.contains(player.x - middleX, centerY);
                // this.walkableAreaManager.contains(centerX, centerY);
        else if (direction == TOP) // top
            return this.walkableAreaManager.contains(centerX, centerY - middleY);
                // this.walkableAreaManager.contains(centerX, centerY);
        else if (direction == DOWN)
            return this.walkableAreaManager.contains(centerX, centerY + middleY);
                // this.walkableAreaManager.contains(centerX, centerY);
        else if (direction == RIGHT_UP)
            return this.walkableAreaManager.contains(centerX + middleX, centerY - middleY);
                // this.walkableAreaManager.contains(centerX, centerY);
        else if (direction == RIGHT_DOWN)
            return this.walkableAreaManager.contains(centerX + middleX, centerY + middleY);
                // this.walkableAreaManager.contains(centerX, centerY);
        else if (direction == LEFT_DOWN)
            return this.walkableAreaManager.contains(centerX - middleX, centerY + middleY);
                // this.walkableAreaManager.contains(centerX, centerY);
        else if (direction == LEFT_UP)
            return this.walkableAreaManager.contains(centerX - middleX, centerY - middleY);
                // this.walkableAreaManager.contains(centerX, centerY);

        return false;
    }

    moveCharacterComplete(param1, param2) {
        this.log('moveCharacterComplet');
        this.isMoving = false;
        this.anims.stop();
    }

    handleMouse(pointer) {
        this.log('handle mouse');
        this.moveCharacter(pointer);
        return true;
    }

}

