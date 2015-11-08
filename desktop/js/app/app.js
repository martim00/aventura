var app = angular.module('adventureApp', []);

app.service("inputService", function() {
  this.askFor = function(txt, fn) {
    bootbox.prompt(txt, fn);               
  }
});

app.controller('MakerAppController', ["inputService", "$scope", function(inputService, $scope) {

  this.inputService = inputService;

  var makerApp = this;
  makerApp.selectedRoom = null;
  makerApp.actualGame = new aventura.app.AdventureGame("Unnamed game");
  makerApp.makeNewGame = function() {
    this.inputService.askFor("What is the name of the game?", function(result) {
      if (result !== null) {
        this.actualGame = new aventura.app.AdventureGame(result);
        $scope.$apply();
      }

    }.bind(this));

  };

  makerApp.createNewRoom = function() {
    this.inputService.askFor("What is the name of the room?", function(result) {
      if (result !== null) {
        this.actualGame.createNewRoom(result);
        this.selectedRoom = result;
        $scope.$apply();
      }

    }.bind(this));

  };

  makerApp.setSelectedRoom = function(room) {
    this.selectedRoom = room;
  };

  makerApp.getRoomStyle = function(room) {
    return this.selectedRoom === room ? "selected" : "unselected";

  };

}]);

