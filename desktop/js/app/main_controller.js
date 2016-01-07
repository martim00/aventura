var app = angular.module('adventureApp');

app.controller('MainController', ["inputService", "previewService", "gameService", "$scope", 
    function(inputService, previewService, gameService, $scope) {

    this.inputService = inputService;
    this.previewService = previewService;
    this.gameService = gameService;

    this.canvas = new aventura.app.EditorCanvas();

    this.elementSelected = undefined;

    this.initializeTestValues = function() {

        this.gameService.getActualGame().open("c:/users/aniceto/workspace/aventura/desktop/game-folder");

        /*/this.gameService.getActualGame().createNewRoom("room1");
        this.gameService.getActualGame().currentRoom.bg = "bg3.png";
        this.setSelectedRoom(this.gameService.getActualGame().currentRoom);
        this.gameService.getActualGame().createNewCharacter("hero");
        this.gameService.getActualGame().getCurrentCharacter()
            .setSprite(new aventura.app.SpriteSheet("hero1", "adventure_time_grid.png", 32, 48));
        this.gameService.getActualGame().save();        
        this.rooms = this.gameService.getActualGame().rooms;*/
    }


    this.initializeCanvas = function() {
        this.canvas.init(this.gameService.getActualGame());
    };

    this.invalidateCanvas = function() {

        this.canvas.invalidate();

    };

    this.makeNewGame = function() {
        this.inputService.askForGameSettings(function(result, name, folder) {
            if (result) {
                this.gameService.getActualGame() = new aventura.app.AdventureGame(name, folder);
                $scope.$apply();
            }

        }.bind(this));

    };

    this.createNewRoom = function() {
        this.inputService.askFor("What is the name of the room?", function(result) {
            if (result !== null) {
                this.gameService.getActualGame().createNewRoom(result);
                //this.setSelectedRoom(result);
                //this.invalidateTreeView();
                $scope.$apply();
            }
        }.bind(this));

    };

    this.createNewCharacter = function() {
        this.inputService.askForCharacter(function(result) {
            if (result !== null) {
                this.gameService.getActualGame().createNewCharacter(result);
                $scope.$apply();
            }
        }.bind(this));

    }

    this.askForBackground = function() {
        this.inputService.askForFile("#bg-input", function(file, rawData) {
            //console.log(file);
            //console.log(rawData);

            this.gameService.getActualGame().setCurrentRoomBg(file.name, rawData, function() {
                this.invalidateCanvas();

            }.bind(this));

            //writeToFile("c:/tmp/nw.png", rawData);
            //writeToFile(path, rawData);
            /*window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {

                (function(f) {
                    fs.root.getFile(file.name, {create: true, exclusive: true}, function(fileEntry) {
                        fileEntry.createWriter(function(fileWriter) {
                        fileWriter.write(f); 
                    }, fileErrorHandler);
                }, fileErrorHandler);
                })(file);

            }, fileErrorHandler);*/

        }.bind(this));
    };

    this.setActiveTool = function(tool) {
        if (this.activeTool)
            this.activeTool.deactivate();
        this.activeTool = tool;
        this.activeTool.activate();
    }

    this.askForWalkableArea = function() {
        this.setActiveTool(new aventura.app.DrawTool(this.canvas, this.gameService.getActualGame()));
    }

    this.askForStartPosition = function() {
        this.inputService.askForStartPosition(function(x, y, room) {
            // todo: save

        });


    }

    this.invalidateView = function() {
        $scope.$apply();
    };

    this.askForCharacterSprite = function() {
        this.inputService.askForFile("#sprite-input", function(file, rawData) {

            // TODO: parametrize this 
            this.gameService.getActualGame().setCharacterSprite("player1", file.name, 48, 32, rawData, function() {
                this.invalidateView();
                console.log("done");

            }.bind(this));

        }.bind(this));

    };

    this.setSelectedRoom = function(room) {
        this.gameService.getActualGame().setCurrentRoom(room);
        this.invalidateCanvas();
        this.elementSelected = { 'type' : 'room', 'element' : room };
    };

    this.setSelectedCharacter = function(character) {
        this.gameService.getActualGame().setCurrentCharacter(character);
        this.elementSelected = { 'type' : 'character', 'element' : character };
    }

    this.setSelectedItem = function(item) {
        this.elementSelected = { 'type' : 'item', 'element' : item };
    }

    this.getSelectedElement = function() {
        return this.elementSelected;
    }

    this.getElementStyle = function(element) {
        return this.elementSelected && this.elementSelected.element === element ? "selected" : "unselected";
    };

    this.isElementSelected = function(elementName) {
        return this.elementSelected && elementName === this.elementSelected.type;
    };

    this.runGame = function() {
        this.previewService.previewGame();
    }

    this.saveGame = function() {
        this.gameService.getActualGame().save();
    }

    this.getGameTree = function() {
        var result = [];
        this.gameService.getActualGame().rooms.forEach(function(room) {
            result.push({text : room.name, state : 
                {
                    selected: this.gameService.getActualGame().isCurrentRoom(room.name)
                }
            });

        }.bind(this));
        return result;
       /*return [
       {
            text: "Parent 1",
            nodes: [
            {
                text: "Child 1",
            }]
      }];*/
    };

    this.invalidateTreeView = function() {
        $('#game-tree').treeview({
            data: this.getGameTree(),
            onNodeSelected: function(event, data) {
                this.setSelectedRoom(data.text);
                //$('#game-tree').treeview('disableNode', [ event.nodeId, { silent: true } ]);

//                this.invalidateTreeView();

                console.log(event);
                console.log(data);
            }.bind(this),
            onNodeUnselected : function(event, data) {
 //               this.invalidateTreeView();
                //var selected = $('#tree').treeview('getSelected', data.nodeId);
                //if (selected.length == 0) 
                 //   $('#game-tree').treeview('selectNode', [ data.nodeId, { silent: true } ]);
                //this('selectNode', [ data.nodeId, { silent: true } ]);
                //this.selectNode(data.nodeId);

            }.bind(this)
        });

        //$('#tree').treeview(true).selectNode([ nodeId, { silent: true } ]);
        //$('#game-tree').treeview('selectNode', [ nodeId, { silent: true } ])
    }

    this.getActualGame = function() {
        return this.gameService.getActualGame();
    }

    this.open = function() {

    }

    //this.invalidateTreeView();
    this.initializeCanvas();
    this.invalidateCanvas();
    this.initializeTestValues();

    /*$('#game-tree').treeview({
        data: this.getGameTree()
    });*/



}]);

