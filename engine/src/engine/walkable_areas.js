var debug = true;
export class WalkableAreas {

    constructor() {
	    this.walkableAreas = [];
    }

    init(roomData, scene) {
	    if (!roomData.walkableAreas)
		    return;

	    roomData.walkableAreas.forEach(function(walkable) {

            var walkableArea = new Phaser.Geom.Polygon();
            this.walkableAreas.push(walkableArea);

            var polygon = [];
            walkable.forEach(function(point) {
                polygon.push(new Phaser.Geom.Point(point['x'], point['y']));
            });
            
            walkableArea.setTo(polygon);

            var graphics = scene.add.graphics(0, 0);
            graphics.alpha = debug ? 0.5 : 0;	
            graphics.lineStyle(2, 0x00aa00);
            graphics.beginPath();
            graphics.moveTo(walkableArea.points[0].x, walkableArea.points[0].y);

            for (var i = 1; i < walkableArea.points.length; i++)
            {
                graphics.lineTo(walkableArea.points[i].x, walkableArea.points[i].y);
            }

            graphics.closePath();
            graphics.strokePath();
	    
	    }.bind(this));

    }

    contains(x, y) {

        for (var i = 0; i < this.walkableAreas.length; i++) {
            if (this.walkableAreas[i].contains(x, y))
                return true;
        }
        return false;
    }

}