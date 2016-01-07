goog.provide("aventura.app.DrawInteraction");

aventura.app.DrawInteraction = function(canvasEditor) {
	DbC.requireNotNull(canvasEditor, "canvasEditor");
	this.canvasEditor = canvasEditor;
	//this.canvas = this.canvasEditor.getCanvas();

	//this.onMouseDblClickHandler = this.onMouseDoubleClicked.bind(this);
	//this.onMouseMoveHandler = this.onMouseMove.bind(this);
	//this.onMouseDownHandler = this.onMouseDown.bind(this);

	this.onPolygonCompletedHandlers = [];

    // Create a simple drawing tool:
    this.tool = new paper.Tool();
    //var path = null;
    var path = null;
    //new paper.Path();

        // Define a mousedown and mousedrag handler
    this.tool.onMouseDown = function(event) {
        if (event.event.detail > 1) { // dbl click
            path.closed = true;
            this.callOnPolygonCompletedHandlers(path);
            path = null;
        } else {
            if (!path) {
                path = new paper.Path();                
                path.strokeColor = 'black';
                path.fillColor = new paper.Color(1, 0, 0.5, 0.5);   
                path.add(event.point);
            }

            path.add(event.point);
        }
    }.bind(this);

    this.tool.onMouseMove = function(event) {
        if (path && path.segments.length > 1) {
           path.removeSegment(path.segments.length - 1);
           path.add(event.point);
        }

    }
}

//http://stackoverflow.com/questions/28769421/wrong-border-coords-on-draw-a-polygon-with-the-fabric-js

aventura.app.DrawInteraction.prototype.onMouseMove = function(event) {
//function onMouseMove(event) {
    var pos = this.canvas.getPointer(event.e);
    //console.log(pos);
    if (this.mode === "edit" && this.currentShape) {
        var points = this.currentShape.get("points");
        //points[points.length - 1].x = pos.x;        
        //points[points.length - 1].y = pos.y;
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
    	console.log("mouse down " + pos.x + ", " + pos.y);
        var points = this.currentShape.get("points");
        points.push({
            x: pos.x - this.currentShape.get("left"),
            y: pos.y - this.currentShape.get("top")
            //x: pos.x,
            //y: pos.y
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

    this.callOnPolygonCompletedHandlers(this.currentShape);

    /*this.currentShape.set({
    	selectable: true
    });
    //this.currentShape._calcDimensions(false);
    this.currentShape.setCoords();*/
    this.currentShape = null;

	//this.mode = 'add';
}

aventura.app.DrawInteraction.prototype.stop = function() {
    /*this.canvas.off("mouse:move", this.onMouseMoveHandler);
    this.canvas.off('mouse:dblclick', this.onMouseDblClickHandler);
    this.canvas.off("mouse:down", this.onMouseDownHandler);*/
    this.tool.stop();
}

aventura.app.DrawInteraction.prototype.start = function() {

    this.tool.activate();

    return;

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

aventura.app.DrawInteraction.prototype.onPolygonCompleted = function(fn) {
	this.onPolygonCompletedHandlers.push(fn);
}

aventura.app.DrawInteraction.prototype.callOnPolygonCompletedHandlers = function(path) {

    var points = path.segments.map(function(segment) {
        console.log(segment);
        return {
            x: segment.point.getX(),
            y: segment.point.getY()
        }

    });

    this.onPolygonCompletedHandlers.forEach(function(handler) {
        handler(points);
    });

return;
	var pCenter = polygon.getCenterPoint();
	var l = polygon.get("left");
    var t = polygon.get("top");
    var minx = polygon.get("minX");
    var miny = polygon.get("minY");

	var points = polygon.get('points').map(function(point) {
		return {
			//x: point.x + pCenter.x - l + minx,
            //y: point.y + pCenter.y - t + miny
            x: point.x + pCenter.x,
            y: point.y + pCenter.y
			
        };
	});


	this.onPolygonCompletedHandlers.forEach(function(handler) {
		handler(points);
	});

}