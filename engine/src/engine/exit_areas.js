
var debug = true;

export class ExitAreas {

    constructor(engine) {
        this.engine = engine;
    }

    init(roomData, scene) {
        
        this.exitAreas = [];

        if (!roomData.exits)
            return;

        var polygonArray = [];
        roomData.exits.forEach(function(exitData) {
            
            var exitArea = new Phaser.Geom.Polygon();
            this.exitAreas.push({"polygon" : exitArea, "goTo" : exitData.goTo});
            exitData.polygon.forEach(function(point) {
                polygonArray.push(new Phaser.Geom.Point(point[0], point[1]));
            });
            exitArea.setTo(polygonArray);

            var graphics = scene.add.graphics(0, 0);
            graphics.alpha = debug ? 0.5 : 0;	
            graphics.lineStyle(2, 0x00aa00);
            graphics.beginPath();
            graphics.moveTo(exitArea.points[0].x, exitArea.points[0].y);

            for (var i = 1; i < exitArea.points.length; i++)
            {
                graphics.lineTo(exitArea.points[i].x, exitArea.points[i].y);
            }

            graphics.closePath();
            graphics.strokePath();

        }.bind(this));

    }

    verifyIfPlayerIsInExitArea(player) {

        this.exitAreas.every(function(exitArea) {

            if (exitArea.polygon.contains(player.x, player.y)) {
                this.engine.goToRoom(exitArea.goTo.roomName, exitArea.goTo.playerStart);
                return false;
            }
            return true;

        }.bind(this));

    }
}