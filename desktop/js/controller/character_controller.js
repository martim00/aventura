var app = angular.module('adventureApp');

app.controller('CharacterController', ["$scope", "gameService", function($scope, gameService) {

	this.gameService = gameService;

	this.startRoomSelected = null;

    this.startRoomChanged = function() {
    	console.log("initial room changed -> " + this.startRoomSelected);
    	if (this.startRoomSelected != null) {
    		var actualGame = this.gameService.getActualGame();
    		var room = actualGame.getRoomByName(this.startRoomSelected);
    		actualGame.getCurrentCharacter().setStartRoom(room);
    	}
    }

}]);