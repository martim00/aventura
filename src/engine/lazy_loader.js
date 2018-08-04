
import 'phaser';

export class LazyLoader {

    constructor(game) {
        this.game = game;
    }

    imageLoaded(resourceId, fn) {
        console.log("image loaded");
        fn(resourceId);
    }

    loadLazyImage(resourceId, resourcePath, fn) {
        var loader = new Phaser.Loader(this.game);

        loader.image(resourceId, resourcePath);
        loader.onLoadComplete.addOnce(this.imageLoaded.bind(this, resourceId, fn));
        loader.start();
    }

    spritesheetLoaded(resourceId, fn) {
        console.log("spritesheet loaded");
        fn(resourceId);
    }

    loadLazySpritesheet(resourceId, resourcePath, width, height, fn) {
        var loader = new Phaser.Loader(this.game);

        loader.spritesheet(resourceId, resourcePath, width, height);
        loader.onLoadComplete.addOnce(this.spritesheetLoaded.bind(this, resourceId, fn));
        loader.start();
    }

}