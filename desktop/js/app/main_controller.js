
app.controller('MainController', ["inputService", "previewService", "$scope", function(inputService, previewService, $scope) {

    this.inputService = inputService;
    this.previewService = previewService;

    this.actualGame = new aventura.app.AdventureGame("Unnamed game", 
        "C:/Users/Aniceto/workspace/aventura/desktop/game-folder", 600, 600);


    this.elementSelected = undefined;

    this.initializeTestValues = function() {
        this.actualGame.createNewRoom("room1");
        this.actualGame.currentRoom.bg = "bg3.png";
        this.actualGame.createNewCharacter("hero");
        this.actualGame.getCurrentCharacter()
            .setSprite(new aventura.app.SpriteSheet("hero1", "adventure_time_grid.png", 32, 48));
        this.actualGame.save();
    }


    this.initializeCanvas = function() {
        //this.canvas = new fabric.CanvasWithViewport('main-canvas');
        this.canvas = new fabric.Canvas('main-canvas');
        //this.canvas.setBackgroundColor("rgba(255, 73, 64, 0.6)");
        this.canvas.setDimensions({width: this.actualGame.width, height: this.actualGame.height});

        $(".canvas-container").on('mousewheel', function(e) {
            var delta = e.originalEvent.wheelDelta / 120;
            console.log(delta);

            /*if (delta > 0)
                this.canvas.setZoom(this.canvas.viewport.zoom * 1.1);
            else 
                this.canvas.setZoom(this.canvas.viewport.zoom / 1.1);
            */
           // console.log(zoom);
            //this.canvas.setZoom(zoom);

        }.bind(this));

        /*fabric.Image.fromURL(this.actualGame.getCurrentRoomBg(), function(oImg) {
            this.canvas.add(oImg);
            var path = new fabric.Path('M 0 0 L 200 100 L 170 200 z');
            path.set({ left: 120, top: 120 });
            this.canvas.add(path);
        }.bind(this));*/
    };

    this.invalidateCanvas = function() {

        this.canvas.clear();

        fabric.Image.fromURL(this.actualGame.getCurrentRoomBg(), function(oImg) {
            //oImg.scale(this.canvas.width / oImg.width 
//                , this.canvas.height / oImg.height );
            
            oImg.set({
                width: this.canvas.width,
                height: this.canvas.height,
                selectable: false
            });

            //oImg.alignX = 'none';
            //oImg.alignY = 'none';
            //oImg.meetOrSlice = 'slice'

            this.canvas.add(oImg);

            //this.canvas.setBackgroundImage(oImg);
            //var path = new fabric.Path('M 0 0 L 200 100 L 170 200 z');
            //path.set({ left: 120, top: 120 });
            //this.canvas.add(path);
        }.bind(this));

        // create a rectangle object
        var rect = new fabric.Rect({
            left: 0,
            top: 0,
            fill: 'rgba(100,200,200,0.5)',
            width: this.canvas.width - 1,
            height: this.canvas.height - 1,
            strokeWidth: 1, 
            strokeDashArray: [5, 5],
            stroke: 'rgba(0,0,0,0.5)',
            selectable: false
        });

        // "add" rectangle onto canvas
        this.canvas.add(rect);


        //$scope.$apply();
    };

    this.makeNewGame = function() {
        this.inputService.askForGameSettings(function(result, name, folder) {
            if (result) {
                this.actualGame = new aventura.app.AdventureGame(name, folder);
                $scope.$apply();
            }

        }.bind(this));

    };

    this.createNewRoom = function() {
        this.inputService.askFor("What is the name of the room?", function(result) {
            if (result !== null) {
                this.actualGame.createNewRoom(result);
                //this.setSelectedRoom(result);
                //this.invalidateTreeView();
                $scope.$apply();
            }
        }.bind(this));

    };

    this.createNewCharacter = function() {
        this.inputService.askForCharacter(function(result) {
            if (result !== null) {
                this.actualGame.createNewCharacter(result);
                $scope.$apply();
            }
        }.bind(this));

    }

    this.askForBackground = function() {
        this.inputService.askForFile("#bg-input", function(file, rawData) {
            //console.log(file);
            //console.log(rawData);

            this.actualGame.setCurrentRoomBg(file.name, rawData, function() {
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

    this.invalidateView = function() {
        $scope.$apply();
    };

    this.askForCharacterSprite = function() {
        this.inputService.askForFile("#sprite-input", function(file, rawData) {

            // TODO: parametrize this 
            this.actualGame.setCharacterSprite("player1", file.name, 48, 32, rawData, function() {
                this.invalidateView();
                console.log("done");

            }.bind(this));

        }.bind(this));

    };

    this.setSelectedRoom = function(room) {
        this.actualGame.setCurrentRoom(room);
        this.invalidateCanvas();
        this.elementSelected = 'room';
        $scope.$apply();

    };

    this.getRoomStyle = function(room) {
        return this.actualGame.isCurrentRoom(room) ? "selected" : "unselected";
    };

    this.setSelectedCharacter = function(character) {
        this.actualGame.setCurrentCharacter(character);
        this.elementSelected = 'character';
    }

    this.getCharacterStyle = function(character) {
        return this.actualGame.isCurrentCharacter(character) ? "selected" : "unselected";
    };

    this.isElementSelected = function(elementName) {
        return elementName === this.elementSelected;
    };

    this.runGame = function() {
        this.previewService.previewGame();
    }

    this.saveGame = function() {
        this.actualGame.save();
    }

    this.getGameTree = function() {
        var result = [];
        this.actualGame.rooms.forEach(function(room) {
            result.push({text : room.name, state : 
                {
                    selected: this.actualGame.isCurrentRoom(room.name)
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

    //this.invalidateTreeView();
    this.initializeCanvas();
    this.invalidateCanvas();
    this.initializeTestValues();

    /*$('#game-tree').treeview({
        data: this.getGameTree()
    });*/



}]);

