
export class RoomScene extends Phaser.Scene {

    constructor() {
        super({ key: "room" });
    }

    init(config) {
        this.engine = config['engine'];
        this.roomName = config['roomName'];
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.engine.initRoom(this, this.roomName);
    }

    update() {
        this.engine.callUpdateHandlers();
    }
}



