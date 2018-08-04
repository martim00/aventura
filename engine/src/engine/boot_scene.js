export class BootScene extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'boot' });
    }
 
    preload ()
    {
        // load all files necessary for the loading screen
        this.load.json('gameData', 'assets/game.json');
        // this.load.text("gameData", "assets/game.json");
    }
 
    create ()
    {
        this.scene.start('load');
    }
}
