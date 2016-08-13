var app = angular.module('adventureApp');

app.controller('MainController', ["inputService", "previewService", 
        "gameService", "canvasService", "$scope", "$timeout", 

    function(inputService, previewService, gameService, canvasService, $scope, $timeout) {

    this.inputService = inputService;
    this.previewService = previewService;
    this.gameService = gameService;
    this.canvasService = canvasService;

    //this.canvas = new aventura.app.EditorCanvas();

    this.elementSelected = undefined;

    this.initializeTestValues = function() {

        //this.gameService.getActualGame().open("c:/users/aniceto/workspace/aventura/desktop/game-folder");

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
        this.canvasService.init(this.gameService.getActualGame());
    };

    this.invalidateCanvas = function() {
        this.canvasService.invalidate();
    };

    this.makeNewGame = function() {
        this.inputService.askForGameSettings(function(result, name, folder) {
            if (result) {
                var newGame = new aventura.app.AdventureGame(name, folder);
                newGame.save();
                this.gameService.setActualGame(newGame);
                $scope.$apply();
            }

        }.bind(this));

    };

    this.createNewRoom = function() {
        this.inputService.askFor("What is the name of the room?", function(result) {
            if (result !== null) {
                this.gameService.getActualGame().createNewRoom(result);
                this.setSelectedRoom(this.gameService.getActualGame().getCurrentRoom());
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

    this.createNewItem = function() {
        this.inputService.askForItem(function(result) {
            if (result !== null) {
                this.gameService.getActualGame().createNewItem(result.name, result.label);
                $scope.$apply();
            }
        }.bind(this));
    }

    this.askForItemSprite = function() {

        DbC.require(this.isElementSelected('item'));

        this.inputService.askForFile("#item-sprite-input", function(file, rawData) {

            this.gameService.getActualGame().setItemSprite(
                this.getSelectedElement().element, file.name, 48, 32, rawData);
            console.log("done");
            this.invalidateView();

        }.bind(this));

    }

    this.askForBackground = function() {
        this.inputService.askForFile("#bg-input", function(file, rawData) {
            //console.log(file);
            //console.log(rawData);

            this.gameService.getActualGame().setCurrentRoomBg(file.name, rawData);
            this.invalidateCanvas();

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
        this.setActiveTool(new aventura.app.DrawTool(this.canvasService.getCanvas(), this.gameService.getActualGame()));
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
            this.gameService.getActualGame().setCharacterSprite("player1", file.name, 48, 32, rawData);
            console.log("done");
            this.invalidateView();

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

    this.getItemSpritePath = function() {
        return this.isElementSelected('item') ? this.getActualGame().getItemSpritePath() : "";
    }

    this.runGame = function() {
        this.previewService.previewGame(this.getActualGame().getGameIndex());
    }

    this.liveReload = function() {
        this.previewService.liveReload();
    }

    this.saveAs = function() {
        inputService.askForFolder(function(result, folder) {
            if (result) {
                this.getActualGame().saveAs(folder);
            }

        }.bind(this));

    }

    this.save = function() {
        var actualGame = this.getActualGame();
        if (actualGame.isPristine()) {
            this.saveAs();
        }
        else {
            actualGame.save();
        }
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

    this.getActualGameIndex = function() {
        return this.gameService.getActualGame().getGameIndex();
    }

    this.getCurrentRoom = function() {
        return this.getActualGame().getCurrentRoom();
    }

    this.setInitialRoom = function(room) {
        this.getActualGame().setInitialRoom(room);        
    }

    this.isInitialRoom = function(room) {
        return this.getActualGame().isInitialRoom(room);
    }

    this.showUserOptions = function() {
        this.inputService.askForNewOrOpen(function(isOpen, folder) {
            $timeout(function() {
                if (isOpen) {
                    this.gameService.getActualGame().open(folder);
                }
                else {
                    this.gameService.getActualGame().saveAs(folder);
                }
            }.bind(this), 1000);

        }.bind(this));
    }

    this.openGame = function() {

            this.inputService.askForFolder(function(result, folder) {
                if (result) {
                    try {
                        this.gameService.getActualGame().open(folder);

                    } catch (e) { 
                        bootbox.alert(e.message);
                    }
                    // this.gameService.getActualGame().createNewRoom(result);
                    //this.setSelectedRoom(result);
                    //this.invalidateTreeView();
                    // $scope.$apply();
                }
            }.bind(this));
    }

    //this.invalidateTreeView();
    this.initializeCanvas();
    this.invalidateCanvas();
    this.initializeTestValues();
    this.showUserOptions();
    

    /*$('#game-tree').treeview({
        data: this.getGameTree()
    });*/



}]);

