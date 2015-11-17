
app.controller('MainController', ["inputService", "$scope", function(inputService, $scope) {

    this.inputService = inputService;

    //this.selectedRoom = null;
    this.actualGame = new aventura.app.AdventureGame("Unnamed game", 
        "C:/Users/Aniceto/workspace/aventura/desktop/game-folder", 600, 600);

    this.actualGame.createNewRoom("room1");
    this.actualGame.currentRoom.bg = 
        "Chrysanthemum.jpg";


    this.initializeCanvas = function() {
        this.canvas = new fabric.Canvas('main-canvas');
        this.canvas.setBackgroundColor("rgba(255, 73, 64, 0.6)");
        this.canvas.setDimensions({width: this.actualGame.width, height: this.actualGame.height});
        /*fabric.Image.fromURL(this.actualGame.getCurrentRoomBg(), function(oImg) {
            this.canvas.add(oImg);
            var path = new fabric.Path('M 0 0 L 200 100 L 170 200 z');
            path.set({ left: 120, top: 120 });
            this.canvas.add(path);
        }.bind(this));*/
    }

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
                this.invalidateTreeView();
                $scope.$apply();
            }
        }.bind(this));

    };

    this.askForBackground = function() {
        this.inputService.askForFile("#bg-input", function(file, rawData) {
            console.log(file);
            console.log(rawData);

            this.actualGame.setCurrentRoomBg(file.name, rawData, function() {
                $scope.$apply();    
            });

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
    }

    this.setSelectedRoom = function(room) {
        this.actualGame.setCurrentRoom(room);

        this.canvas.clear();
        fabric.Image.fromURL(this.actualGame.getCurrentRoomBg(), function(oImg) {
            this.canvas.add(oImg);
        }.bind(this));

        $scope.$apply();
    };

    this.getRoomStyle = function(room) {
        return this.actualGame.isCurrentRoom(room) ? "selected" : "unselected";

    };

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
                $('#game-tree').treeview('disableNode', [ event.nodeId, { silent: true } ]);

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

    this.invalidateTreeView();
    this.initializeCanvas();

    /*$('#game-tree').treeview({
        data: this.getGameTree()
    });*/



}]);
