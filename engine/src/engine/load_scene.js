import { Engine } from './engine'

export class LoadScene extends Phaser.Scene {

    constructor() {
        super({ key: "load" });

        this.engine = new Engine(this);
    }

    preload() {
        console.log("%cStarting an adventure game", "color:white; background:red");
        this.engine.load(this);
    }

    create() {
        this.engine.start();
    }
}
