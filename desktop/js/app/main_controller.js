
app.controller('MainController', ["inputService", "$scope", function(inputService, $scope) {

    this.inputService = inputService;

    var makerApp = this;
    this.selectedRoom = null;
    this.actualGame = new aventura.app.AdventureGame("Unnamed game");

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
                this.setSelectedRoom(result);
                this.invalidateTreeView();
                $scope.$apply();
            }
        }.bind(this));

    };

    this.askForBackground = function() {
        this.inputService.askForFile("#bg-input", function(file, filename, rawData) {
            console.log(file);
            console.log(filename);
            console.log(rawData);

            var path = this.actualGame.folder + "/" + filename;

            //writeToFile("c:/tmp/nw.png", rawData);
            writeToFile(path, rawData);

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
        this.selectedRoom = room;
        $scope.$apply();
    };

    this.getRoomStyle = function(room) {
        return this.selectedRoom === room ? "selected" : "unselected";

    };

    this.getGameTree = function() {
        var result = [];
        this.actualGame.rooms.forEach(function(room) {
            result.push({text : room, state : {selected: room == this.selectedRoom}});

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

                console.log(event);
                console.log(data);
            }.bind(this),
        });

        //$('#tree').treeview(true).selectNode([ nodeId, { silent: true } ]);
        //$('#game-tree').treeview('selectNode', [ nodeId, { silent: true } ])
    }

    this.invalidateTreeView();

    /*$('#game-tree').treeview({
        data: this.getGameTree()
    });*/



}]);

