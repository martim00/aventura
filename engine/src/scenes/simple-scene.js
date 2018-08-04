export class SimpleScene extends Phaser.Scene {
  preload() {
    this.load.image('cokecan', 'assets/cokecan.png');
    this.load.image('bg', 'assets/bg3.png');
    this.load.spritesheet('character', 'assets/character.png', {frameWidth: 51, frameHeight: 79});
  }

  create() {
    this.add.image(400, 300, 'bg');
    // this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' });
    // this.add.image(100, 200, 'cokecan');

    this.player = this.add.sprite(100, 400, 'character');
    // this.player.setBounce(0.2);
    // this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'stand', 
      frames: this.anims.generateFrameNumbers('character', {start: 2, end: 2}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'walk', 
      frames: this.anims.generateFrameNumbers('character', {start: 0, end: 5}),
      frameRate: 10,
      repeat: -1
    });
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  update() {
    if (this.cursors.left.isDown) {
        // this.player.setVelocityX(-160);
        this.player.x -= 1;
        this.player.anims.play('walk', true);
        this.player.scaleX = -1
    }
    else if (this.cursors.right.isDown) {
        this.player.x += 1;
        // this.player.setVelocityX(160);
        this.player.anims.play('walk', true);
        this.player.scaleX = 1
    }
    else if (this.cursors.up.isDown) {
        this.player.y -= 1;
        // this.player.setVelocityX(160);
        this.player.anims.play('walk', true);
        this.player.scaleX = 1
    }
    else if (this.cursors.down.isDown) {
        this.player.y += 1;
        // this.player.setVelocityX(160);
        this.player.anims.play('walk', true);
        this.player.scaleX = 1
    }
    else {
        // this.player.setVelocityX(0);
        this.player.anims.play('stand');
    }

    // if (this.cursors.up.isDown && this.player.body.touching.down)
    // {
    //     // this.player.setVelocityY(-330);
    // }
  }
}