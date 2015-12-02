ns.provide('aventura.LazyLoader');

aventura.LazyLoader = function(game) {
	this.game = game;
}

aventura.LazyLoader.prototype.imageLoaded = function(resourceId, fn) {
    console.log("image loaded");
    fn(resourceId);
}

aventura.LazyLoader.prototype.loadLazyImage = function(resourceId, resourcePath, fn) {
    var loader = new Phaser.Loader(this.game);

    loader.image(resourceId, resourcePath);
    loader.onLoadComplete.addOnce(this.imageLoaded.bind(this, resourceId, fn));
    loader.start();
}

aventura.LazyLoader.prototype.spritesheetLoaded = function(resourceId, fn) {
    console.log("spritesheet loaded");
    fn(resourceId);
}

aventura.LazyLoader.prototype.loadLazySpritesheet = function(resourceId, resourcePath, width, height, fn) {
    var loader = new Phaser.Loader(this.game);

    loader.spritesheet(resourceId, resourcePath, width, height);
    loader.onLoadComplete.addOnce(this.spritesheetLoaded.bind(this, resourceId, fn));
    loader.start();
}