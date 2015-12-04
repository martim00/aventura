goog.provide("aventura.app.DrawInteraction");

aventura.app.DrawInteraction = function(canvasEditor) {
	DbC.requireNotNull(canvasEditor, "canvasEditor");
	this.canvasEditor = canvasEditor;
	this.canvas = this.canvasEditor.getCanvas();
}

aventura.app.DrawInteraction.prototype.start = function() {

	 var mode = "add",
        currentShape;

    this.canvas.observe("mouse:move", function (event) {
        var pos = this.canvas.getPointer(event.e);
        if (mode === "edit" && currentShape) {
            var points = currentShape.get("points");
            points[points.length - 1].x = pos.x - currentShape.get("left");
            points[points.length - 1].y = pos.y - currentShape.get("top");
            currentShape.set({
                points: points
            });
            this.canvas.renderAll();
        }
    }.bind(this));

    this.canvas.observe("mouse:down", function (event) {
        var pos = this.canvas.getPointer(event.e);

        if (mode === "add") {
            var polygon = new fabric.Polygon([{
                x: pos.x,
                y: pos.y
            }, {
                x: pos.x + 0.5,
                y: pos.y + 0.5
            }], {
                fill: 'blue',
                opacity: 0.5,
                selectable: false
            });
            currentShape = polygon;
            this.canvas.add(currentShape);
            mode = "edit";
        } else if (mode === "edit" && currentShape && currentShape.type === "polygon") {
            var points = currentShape.get("points");
            points.push({
                x: pos.x - currentShape.get("left"),
                y: pos.y - currentShape.get("top")
            });
            currentShape.set({
                points: points
            });
            this.canvas.renderAll();
        }
    }.bind(this));

    fabric.util.addListener(window, 'keyup', function (e) {
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
    });
}