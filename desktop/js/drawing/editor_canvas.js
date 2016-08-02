ns.provide("aventura.app.EditorCanvas");

aventura.app.EditorCanvas = function() {
}

aventura.app.EditorCanvas.prototype.getCanvas = function(actualGame) {
	return this.canvas;
}

aventura.app.EditorCanvas.prototype.init = function(actualGame) {

	DbC.requireNotNull(actualGame, "actualGame");
	this.actualGame = actualGame;
    this.canvas = document.getElementById('main-canvas');

    //canvas.style.width ='100%';
    //canvas.style.height='100%';

    this.canvas.style.width = this.actualGame.width + 'px'; 
    this.canvas.style.height= this.actualGame.height + 'px';
  // ...then set the internal size to match
    /*canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;*/
        // Create an empty project and a view for the canvas:
    paper.setup(this.canvas);

    this.setupZoom();
  

    return;

    //this.canvas = new fabric.CanvasWithViewport('main-canvas');
    this.canvas = new fabric.CanvasEx('main-canvas');
    //this.canvas.setBackgroundColor("rgba(255, 73, 64, 0.6)");
    this.canvas.setDimensions({width: this.actualGame.width, height: this.actualGame.height});
    this.canvas.freeDrawingCursor='url(http://ani.cursors-4u.net/movie/mov-2/mov130.cur),default';

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

}

aventura.app.EditorCanvas.prototype.setupZoom = function() {

    $(this.canvas).on('mousewheel', function(e) {
        var delta = e.originalEvent.wheelDelta / 120;
        paper.view.zoom = paper.view.zoom + 0.1 * delta;
    }.bind(this));
}

aventura.app.EditorCanvas.prototype.drawWalkableAreas = function() {

    var walkableAreas = this.actualGame.getCurrentRoom().getWalkableAreas();
    walkableAreas.forEach(function(walkableArea) {

        var path = new paper.Path();
        // Give the stroke a color
        path.strokeColor = 'black';
        path.fillColor = new paper.Color(1, 0, 0.5, 0.5);

        var points = walkableArea.getPoints();
        for (var i = 0; i < points.length; i++) {
            var point = points[i];

            if (i == 0) {
                var start = new paper.Point(point.x, point.y);
                // Move to start and draw a line from there
                path.moveTo(start);        
            } else {

                // Note that the plus operator on Point objects does not work
                // in JavaScript. Instead, we need to call the add() function:
                //path.lineTo(start.add([ point.x , point.y ]));               
                path.lineTo( [point.x , point.y] );               

            }
        }     
        path.closed = true;       

        // Draw the view now:
        paper.view.draw();
    });

}

aventura.app.EditorCanvas.prototype.loadBg = function(fn) {

    if (this.actualGame.getCurrentRoomBg() == "") {
        fn();
    }
    else {

        $('#image-placeholder').prepend('<img style="display:none" id="theImg" src="' 
            + this.actualGame.getCurrentRoomBg() + '" />');

        $( "#theImg" ).load(function() {
            // Handler for .load() called.
            var raster = new paper.Raster('theImg');
            
            /*raster.width = this.actualGame.width;
            raster.height = this.actualGame.height;*/

            // Move the raster to the center of the view
            raster.position = paper.view.center;
            var scaleX = this.actualGame.width / raster.width;
            var scaleY = this.actualGame.height / raster.height ;

            raster.scale(scaleX, scaleY);

            fn();
        
        }.bind(this));

    }
}

aventura.app.EditorCanvas.prototype.drawGameRect = function() {
    var width = this.actualGame.getCurrentRoom().getWidth();
    var height = this.actualGame.getCurrentRoom().getHeight();

    var path = new paper.Path();
    // Give the stroke a color
    path.strokeColor = 'black';

    path.moveTo(0, 0);
    path.lineTo(width, 0);
    path.lineTo(width, height);
    path.lineTo(0, height);
    path.closed = true;
    paper.view.draw();
}

aventura.app.EditorCanvas.prototype.invalidate = function() {

    if (!this.actualGame.getCurrentRoom())
        return;

    paper.project.clear();

    this.drawGameRect();

    this.loadBg(function() {
        this.drawWalkableAreas();
    }.bind(this));

return;
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


        var walkableAreas = this.actualGame.getCurrentRoom().getWalkableAreas();
        walkableAreas.forEach(function(walkableArea) {

        var points = walkableArea.getPoints().map(function(point) {
                return {            
                    x: point.x ,
                    y: point.y             
                };
            });
            var polygon = new fabric.Polygon(points);
            this.canvas.add(polygon);
        }.bind(this));
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
}