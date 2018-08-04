import { Engine } from './engine'

export class LoadScene extends Phaser.Scene {

    constructor() {
        super({ key: "load" });

        // this.load.text("gameData", "assets/game.json");
        this.engine = new Engine(this);
    }

    preload() {
        console.log("%cStarting an adventure game", "color:white; background:red");
        this.engine.load(this);
    }

    create() {
        this.engine.start();
        // this.engine.loadAndStart();
    }
}

// var load = function(game){
// 	console.log("%cStarting an adventure game", "color:white; background:red");
// 	this.game = game;
// };
  
// load.prototype = {
// 	preload: function(){
// 		game.load.text("gameData", "game.json");

// 	},
//   	create: function() {
// 		//this.game.state.start("menu");

//         this.engine = new aventura.Engine(this.game);
//         this.engine.loadAndStart();
// 	}
// }