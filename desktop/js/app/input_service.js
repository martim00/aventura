var app = angular.module('adventureApp');

app.service("inputService", function() {
    this.askFor = function(txt, fn) {
        bootbox.prompt(txt, fn);               
    };

    this.askForFolder = function() {
    }

    this.getGameSettingsContent = function() {
        var content = $('<div class="row"></div>').html(            
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
                    '</form> </div>'
        );

        var chooser = content.find('#folderChooser');
        var folderInput = content.find('#folder');
        chooser.unbind('change');
        chooser.change(function(evt) {
            var files = evt.target.files;
            if (files.length > 0)
                folderInput.val(files[0].path);

            
        }.bind(this));

        return content;
    }

    this.askForGameSettings = function(fn) {
        bootbox.dialog({
            message: this.getGameSettingsContent(),
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
                    fn(theFile, e.target.result);
                    // Render thumbnail.
                    /*var span = document.createElement('span');
                    span.innerHTML = ['<img class="thumb" src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');
                    document.getElementById('list').insertBefore(span, null);*/
                };
            })(f);

            // Read in the image file as a data URL.
            //reader.readAsBinaryString(f);
            reader.readAsArrayBuffer(f);
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

    this.askForCharacter = function(fn) {
        bootbox.dialog({
            message: this.getCharacterSettingsContent(),
            title: "Character settings",
            buttons: {
                success: {
                    label: "Ok",
                    className: "btn-success",
                    callback: function() {
                        var name = $('#name').val();
                        //var folder = $('#folderChooser').val();
                        fn(name);
                    } 
                },
                cancel : {
                    label: "Cancel",
                    className: "btn-primary",
                    callback: function() {
                        fn(null);
                    }
                }
            }
        });
    }

    this.getCharacterSettingsContent = function() {
        var content = $('<div class="row"></div>').html(            
                    '<div class="col-md-12"> ' +
                    '<form class="form-horizontal"> ' +
                    '<div class="form-group"> ' +
                    '<label class="col-md-4 control-label" for="name">Name</label> ' +
                    '<div class="col-md-4"> ' +
                    '<input id="name" name="name" type="text" placeholder="Your character name" class="form-control input-md"> ' +
                    ' </div> ' +
                    '</div> ' +
                    /*'<div class="form-group"> ' +
                    '<label class="col-md-4 control-label" for="folder">Folder</label> ' +
                    '<div class="col-md-4"> ' +
                    '<input id="folder" name="folder" type="text" placeholder="Your game folder" class="form-control input-md"> ' +
                    '<input id="folderChooser" type="file" nwdirectory webkitdirectory />' +
                    '<span class="help-block">Folder where the game source and assets will be placed</span> </div> ' +*/
                    '</div> ' +                    
                    '</form> </div>'
        );

        /*var chooser = content.find('#folderChooser');
        var folderInput = content.find('#folder');
        chooser.unbind('change');
        chooser.change(function(evt) {
            var files = evt.target.files;
            if (files.length > 0)
                folderInput.val(files[0].path);

            
        }.bind(this));*/

        return content;
    }


});
