
var menu = function(game){
};
  
menu.prototype = {
	preload: function() {
		game.stage.backgroundColor = '#71c5cf';
	},
  	create: function(){
    	//var gameTitle = game.add.text(16, 16, 'My awesome adventure', { fontSize: '32px', fill: '#000' });

		var gameTitle = this.game.add.sprite(300, 200, "title");
		gameTitle.anchor.setTo(0.5,0.5);
		var playButton = this.game.add.button(480, 320, "playButton", this.playTheGame, this);
		playButton.anchor.setTo(0.5,0.5);
	},
	playTheGame: function() {
		this.game.state.start("room1", true, false, "room1", [32, 350]);
	}
}