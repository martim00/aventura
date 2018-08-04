
var debug = true;

export class ClickableAreas {
    constructor(engine) {
        this.engine = engine;
    }

    init(roomData, scene) {
        this.clickableAreas = [];

        if (!roomData.clickableAreas)
            return;

        roomData.clickableAreas.forEach(function(clickableData) {
            
            var clickableArea = new Phaser.Geom.Polygon();
            var polygonArray = [];
            this.clickableAreas.push({"polygon" : clickableArea, "actions" : clickableData.actions});
            clickableData.polygon.forEach(function(point) {
                polygonArray.push(new Phaser.Geom.Point(point[0], point[1]));
            });
            clickableArea.setTo(polygonArray);

            var graphics = scene.add.graphics(0, 0);
            graphics.alpha = debug ? 0.5 : 0;	
            graphics.lineStyle(2, 0x00aa00);
            graphics.beginPath();
            graphics.moveTo(clickableArea.points[0].x, clickableArea.points[0].y);

            for (var i = 1; i < clickableArea.points.length; i++)
            {
                graphics.lineTo(clickableArea.points[i].x, clickableArea.points[i].y);
            }

            graphics.closePath();
            graphics.strokePath();

        }.bind(this));

    }

    doClickableActions(clickableArea) {

        clickableArea.actions.forEach(function(action) {
            var methodName = action.name;
            var params = action.params;
            var sliced = Array.prototype.slice.call(params, 1);
            console.log(sliced);
            var enableIf = action.enableIf;
            var result = eval(enableIf);
            console.log(result);
            if (!enableIf || (enableIf && eval(result)))
                this.engine[methodName].apply(this.engine, params);
        }.bind(this));
    }

    handleMouse(pointer) {

        for (var i = 0; i < this.clickableAreas.length; i++) {
            var clickableArea = this.clickableAreas[i];
            if (clickableArea.polygon.contains(pointer.x, pointer.y)) {
                this.doClickableActions(clickableArea);
                return false;
            }        
        }
        return true;

    }

}