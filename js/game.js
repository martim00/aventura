var game = new Phaser.Game(671, 548, Phaser.AUTO, '');
game.state.add("load", load);
game.state.add("menu", menu);
game.state.add("room1", room1);
game.state.add("room2", room2);
game.state.start("load");
