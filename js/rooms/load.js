
var load = function(game){
	console.log("%cStarting an adventure game", "color:white; background:red");
};
  
load.prototype = {
	preload: function(){
		// load all assets here
		game.load.image('sky', 'assets/sky.png');
    	game.load.image('ground', 'assets/platform.png');
    	game.load.image('star', 'assets/star.png');
    	game.load.image('bg1', 'assets/bg3.png');
    	game.load.image('bg2', 'assets/bg2.png');
    	game.load.image('playButton', 'assets/playButton.png');
    	game.load.image('title', 'assets/title.png');
    	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    	game.load.spritesheet('hero', 'assets/adventure_time_grid.png', 32, 48);
		game.load.text("rooms", "assets/rooms.json");

	},
  	create: function(){
		this.game.state.start("menu");
	}
}