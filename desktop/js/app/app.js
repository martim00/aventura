var app = angular.module('adventureApp', []);

app.service("inputService", function() {
    this.askFor = function(txt, fn) {
        bootbox.prompt(txt, fn);               
    };

    this.askForFolder = function() {
    }

    this.askForGameSettings = function(fn) {
        bootbox.dialog({
            message: '<div class="row">  ' +
                    '<div class="col-md-12"> ' +
                    '<form class="form-horizontal"> ' +
                    '<div class="form-group"> ' +
                    '<label class="col-md-4 control-label" for="name">Name</label> ' +
                    '<div class="col-md-4"> ' +
                    '<input id="name" name="name" type="text" placeholder="Your game name" class="form-control input-md"> ' +
                    ' </div> ' +
                    '</div> ' +
                    '<div class="form-group"> ' +
                    '<label class="col-md-4 control-label" for="folder">Folder</label> ' +
                    '<div class="col-md-4"> ' +
                    '<input id="folder" name="folder" type="text" placeholder="Your game folder" class="form-control input-md"> ' +
                    '<input id="folderChooser" type="file" nwdirectory webkitdirectory />' +
                    '<span class="help-block">Folder where the game source and assets will be placed</span> </div> ' +
                    '</div> ' +
                    /*'<div class="form-group"> ' +
                    '<label class="col-md-4 control-label" for="awesomeness">How awesome is this?</label> ' +
                    '<div class="col-md-4"> <div class="radio"> <label for="awesomeness-0"> ' +
                    '<input type="radio" name="awesomeness" id="awesomeness-0" value="Really awesome" checked="checked"> ' +
                    'Really awesome </label> ' +
                    '</div><div class="radio"> <label for="awesomeness-1"> ' +
                    '<input type="radio" name="awesomeness" id="awesomeness-1" value="Super awesome"> Super awesome </label> ' +
                    '</div> ' +
                    '</div> </div>' +*/
                    '</form> </div>  </div>',
            title: "Game settings",
            buttons: {
                success: {
                    label: "Ok",
                    className: "btn-success",
                    callback: function() {
                        var name = $('#name').val();
                        var folder = $('#folderChooser').val();
                        fn(true, name, folder);
                    } 
                },
                cancel : {
                    label: "Cancel",
                    className: "btn-primary",
                    callback: function() {
                        fn(false, "", "");
                    }
                }
            }
        });
    }

    this.handleFileSelect = function(evt, fn) {
        var files = evt.target.files; // FileList object

        // files is a FileList of File objects. List some properties.
        var output = [];
        for (var i = 0, f; f = files[i]; i++) {
            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                    fn(theFile.name, e.target.result);
                    // Render thumbnail.
                    /*var span = document.createElement('span');
                    span.innerHTML = ['<img class="thumb" src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');
                    document.getElementById('list').insertBefore(span, null);*/
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsBinaryString(f);
            //reader.readAsDataURL(f);

            /*output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');*/
        }
        //console.log(output);
        //document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  }

    this.askForFile = function(id, fn) {

       var chooser = $(id);
       chooser.unbind('change');
       chooser.change(function(evt) {
            this.handleFileSelect(evt, fn)
            //console.log($(this).val());
            //fn($(this).val());
      }.bind(this));

        //document.getElementById('files').addEventListener('change', handleFileSelect, false);
       chooser.trigger('click');  
  };
});

app.controller('MakerAppController', ["inputService", "$scope", function(inputService, $scope) {

    this.inputService = inputService;


    var makerApp = this;
    makerApp.selectedRoom = null;
    makerApp.actualGame = new aventura.app.AdventureGame("Unnamed game");

    makerApp.makeNewGame = function() {
        this.inputService.askForGameSettings(function(result, name, folder) {
            if (result) {
                this.actualGame = new aventura.app.AdventureGame(name, folder);
                $scope.$apply();
            }

        }.bind(this));

    };

    makerApp.createNewRoom = function() {
        this.inputService.askFor("What is the name of the room?", function(result) {
            if (result !== null) {
                this.inputService.askFor();
                this.actualGame.createNewRoom(result);
                this.selectedRoom = result;
                $scope.$apply();
            }
        }.bind(this));

    };

    makerApp.askForBackground = function() {
        this.inputService.askForFile("#bg-input", function(file, rawData) {
            console.log(file);
            console.log(rawData);

        });
    }

    makerApp.setSelectedRoom = function(room) {
        this.selectedRoom = room;
    };

    makerApp.getRoomStyle = function(room) {
        return this.selectedRoom === room ? "selected" : "unselected";

    };

    makerApp.getGameTree = function() {
       return [
       {
            text: "Parent 1",
            nodes: [
            {
                text: "Child 1",
            }]
      }];
    };

    $('#game-tree').treeview({data: makerApp.getGameTree()});

}]);

