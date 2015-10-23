
var room2 = function(game){
};
  
room2.prototype = {
	preload: function() {
		//game.stage.backgroundColor = '#71c5cf';
	},
  	create: function(){
    	var bg = game.add.sprite(0, 0, 'room2bg');
    	bg.width = 671;
    	bg.height = 548;
	}
}