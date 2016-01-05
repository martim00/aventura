goog.provide("aventura.app.EditorCanvas");

aventura.app.EditorCanvas = function() {
}

aventura.app.EditorCanvas.prototype.getCanvas = function(actualGame) {
	return this.canvas;
}

aventura.app.EditorCanvas.prototype.init = function(actualGame) {

	DbC.requireNotNull(actualGame, "actualGame");
	this.actualGame = actualGame;

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


aventura.app.EditorCanvas.prototype.invalidate = function() {

    this.canvas.clear();

    if (!this.actualGame.getCurrentRoom())
        return;

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