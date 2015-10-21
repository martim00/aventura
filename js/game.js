var game = new Phaser.Game(671, 548, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var score = 0;
var scoreText;

function preload() {
	game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('bg', 'assets/bg3.png');
    game.load.image('walkable', 'assets/walkable_area.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('hero', 'assets/adventure_time_grid.png', 32, 48);

    //game.load.physics('physicsData', 'assets/walkable.json');
}

function create() {
	 //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.Arcade);

    //  A simple background for our game
    game.add.sprite(0, 0, 'bg');
    //game.add.sprite(0, 0, 'walkable');

    walkable_areas = game.add.group();
    walkable_areas.enableBody = true;

    walkable1 = walkable_areas.create(0, 0, 'walkable');
    walkable1.body.immovable = true;

    //  The platforms group contains the ground and the 2 ledges we can jump on
    //platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    //platforms.enableBody = true;

    // Here we create the ground.
    //var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    //ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    //ground.body.immovable = true;

    //  Now let's create two ledges
    //var ledge = platforms.create(400, 400, 'ground');

    //ledge.body.immovable = true;

    //ledge = platforms.create(-150, 250, 'ground');

    //ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'hero');

    //player.pivot.x = player.width * .5;
	//player.pivot.y = player.height * .5;
    //player.anchor.setTo(0.5, 0.5);

    //  We need to enable physics on the player
    game.physics.arcade.enable(player, true);

    //  Player physics properties. Give the little guy a slight bounce.
    //player.body.bounce.y = 0.2;
    player.body.gravity.y = 0;
    player.body.collideWorldBounds = true;


    
   

    //  Our two animations, walking left and right.
    player.animations.add('left', [10, 11, 12, 14], 10, true);
    player.animations.add('right', [5, 6, 8, 9], 10, true);
    player.animations.add('up', [15, 16, 18, 19], 10, true);
    player.animations.add('down', [0, 1, 3, 4], 10, true);

    cursors = game.input.keyboard.createCursorKeys();

    poly = new Phaser.Polygon();

    //  And then populate it via setTo, using any combination of values as above
    poly.setTo([ new Phaser.Point(0, 400)
    	, new Phaser.Point(25, 340)
    	, new Phaser.Point(40, 340)
    	, new Phaser.Point(70, 400)
    	, new Phaser.Point(671, 450)
    	, new Phaser.Point(671, 548)
    	, new Phaser.Point(0, 548)


     ]);

    graphics = game.add.graphics(0, 0);

    graphics.alpha = 0.5;

    graphics.beginFill(0xFF33ff);
    graphics.drawPolygon(poly.points);
    graphics.endFill();

    //stars = game.add.group();

    //stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    /*for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 6; 

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }*/
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
}


function playerCanWalk(direction, player) {
	if (direction == 1) // right
		return poly.contains(player.body.x + player.width, player.body.y) ||
			poly.contains(player.body.x + player.width, player.body.y + player.height);
	else if (direction == 2) //left
		return poly.contains(player.body.x, player.body.y) ||
			poly.contains(player.body.x, player.body.y + player.height);
	else if (direction == 3) // top
		return poly.contains(player.body.x, player.body.y) ||
			poly.contains(player.body.x + player.width, player.body.y);
	else if (direction == 4)
		return poly.contains(player.body.x, player.body.y + player.height) ||
			poly.contains(player.body.x + player.width, player.body.y + player.height);

	return false;

	/*if (poly.contains(player.body.x, player.body.y) 
    	&& poly.contains(player.body.x + player.width, player.body.y)
    	&& poly.contains(player.body.x + player.width, player.body.y + player.height)
    	&& poly.contains(player.body.x, player.body.y + player.height)
    	)
    	return true;*/
}

function update() {
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

    //  Allow the player to jump if they are touching the ground.

}

function overlap_walkable (player, walkable_area) {

	console.log("overlapping");
//	playerCanWalk = true;

}

function collectStar (player, star) {

    // Removes the star from the screen
    star.kill();


    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}