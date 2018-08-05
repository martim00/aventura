export class AudioManager {
    constructor(engine) {
        this.engine = engine;
        this.defaultAudio = null;
        this.currentAudio = null;
    }
    playDefaultAudio(defaultAudio) {
        if (defaultAudio === undefined)
            return;

        this.defaultAudio = this.currentAudio = this.engine.getLoadScene().sound.add(defaultAudio);
        this.defaultAudio.play();
    }

    playRoomAudio(roomAudio) {
        if (roomAudio !== undefined) {

            if (this.currentAudio)
                this.currentAudio.stop();

            this.currentAudio = this.engine.getRoomScene().sound.add(roomAudio);
            this.currentAudio.play();

        } else {

            // if there is a audio coming from old room we should stop (only if it's not a default audio)
            if (this.currentAudio && this.currentAudio != this.defaultAudio) {
                this.currentAudio.stop();
            }

            // if there is a default audio we should play it
            if (this.defaultAudio) {
                this.currentAudio = this.defaultAudio;
                this.currentAudio.play();
            }
        }

    }
}