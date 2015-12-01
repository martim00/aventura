var game = new Phaser.Game(671, 419, Phaser.AUTO, '');
game.state.add("load", load);
game.state.add("menu", menu);
game.state.add("room", Room);
game.state.start("load");
