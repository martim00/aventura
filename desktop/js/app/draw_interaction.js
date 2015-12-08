goog.provide("aventura.app.DrawInteraction");

aventura.app.DrawInteraction = function(canvasEditor) {
	DbC.requireNotNull(canvasEditor, "canvasEditor");
	this.canvasEditor = canvasEditor;
	this.canvas = this.canvasEditor.getCanvas();

	this.onMouseDblClickHandler = this.onMouseDoubleClicked.bind(this);
	this.onMouseMoveHandler = this.onMouseMove.bind(this);
	this.onMouseDownHandler = this.onMouseDown.bind(this);
}
aventura.app.DrawInteraction.prototype.onMouseMove = function(event) {
//function onMouseMove(event) {
    var pos = this.canvas.getPointer(event.e);
    if (this.mode === "edit" && this.currentShape) {
        var points = this.currentShape.get("points");
        points[points.length - 1].x = pos.x - this.currentShape.get("left");
        points[points.length - 1].y = pos.y - this.currentShape.get("top");
        this.currentShape.set({
            points: points
        });
        this.canvas.renderAll();
    }
}	

aventura.app.DrawInteraction.prototype.onMouseDown = function(event) {

    var pos = this.canvas.getPointer(event.e);
    this.canvas.defaultCursor = "crosshair";

    if (this.mode === "add") {
        var polygon = new fabric.Polygon([{
            x: pos.x,
            y: pos.y
        }, {
            x: pos.x + 0.5,
            y: pos.y + 0.5
        }], {
            fill: 'blue',
            stroke: 'black',
            opacity: 0.5,
            selectable: false
        });
        this.currentShape = polygon;
        this.canvas.add(this.currentShape);
        this.mode = "edit";
    } else if (this.mode === "edit" && this.currentShape && this.currentShape.type === "polygon") {
        var points = this.currentShape.get("points");
        points.push({
            x: pos.x - this.currentShape.get("left"),
            y: pos.y - this.currentShape.get("top")
        });
        this.currentShape.set({
            points: points
        });
        this.canvas.renderAll();
    }

}

aventura.app.DrawInteraction.prototype.onMouseDoubleClicked = function(options) {
	 // remove last useless point
    var points = this.currentShape.get("points");
    points.pop(); 
    this.currentShape.set({points: points});

    // call helpers
    this.currentShape._calcDimensions();
    this.currentShape.setCoords();

    // adjust shape position by using minX and minY offsets
    var minx = this.currentShape.get("minX");
    var miny = this.currentShape.get("minY");
    this.currentShape.set({
        left: this.currentShape.get("left") + minx,
        top: this.currentShape.get("top") + miny
    });

    // adjust points coordinates by 
    // 1- subtracting the center point coords 
    // 2- adding the left-top coords  
    // 3- subtracting minX and minY offsets
    var pCenter = this.currentShape.getCenterPoint();
    var l = this.currentShape.get("left");
    var t = this.currentShape.get("top");
    var adjPoints = this.currentShape.get("points").map(function(p) {
        return {
            x: p.x - pCenter.x + l - minx,
            y: p.y - pCenter.y + t - miny
        };
    });
    this.currentShape.set({
        points: adjPoints,
        selectable: true
    });

    this.canvas.setActiveObject(this.currentShape);

    this.canvas.renderAll();

    /*this.currentShape.set({
    	selectable: true
    });
    //this.currentShape._calcDimensions(false);
    this.currentShape.setCoords();*/
    this.currentShape = null;

	//this.mode = 'add';
}

aventura.app.DrawInteraction.prototype.stop = function() {
    this.canvas.off("mouse:move", this.onMouseMoveHandler);
    this.canvas.off('mouse:dblclick', this.onMouseDblClickHandler);
    this.canvas.off("mouse:down", this.onMouseDownHandler);
}

aventura.app.DrawInteraction.prototype.start = function() {

	this.mode = "add";
    this.currentShape = null;

    //var listeners = this.canvas.__eventListeners["mouse:dblclick"];

    this.canvas.on("mouse:move", this.onMouseMoveHandler);
    this.canvas.on('mouse:dblclick', this.onMouseDblClickHandler);
    this.canvas.on("mouse:down", this.onMouseDownHandler);

     //listeners = this.canvas.__eventListeners["mouse:dblclick"];

    /*fabric.util.addListener(window, 'keyup', function (e) {
        if (e.keyCode === 27) {
            if (mode === 'edit' || mode === 'add') {
                mode = 'normal';
                currentShape.set({
                    selectable: true
                });
                currentShape._calcDimensions(false);
                currentShape.setCoords();
            } else {
                mode = 'add';
            }
            currentShape = null;
        }
    });*/
}