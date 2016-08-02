var app = angular.module('adventureApp');

app.service("gameService", function() {

    this.actualGame = new aventura.app.AdventureGame("Unnamed game", 
        "", 600, 600);

    this.getActualGame = function() {
    	return this.actualGame;
    }

    this.setActualGame = function(actualGame) {
    	this.actualGame = actualGame;
    }

});