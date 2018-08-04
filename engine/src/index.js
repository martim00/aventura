import 'phaser';
import {Engine} from './engine/engine'

import { SimpleScene } from './scenes/simple-scene';
import { LoadScene } from './engine/load_scene';
import { RoomScene } from './engine/room_scene';
import { BootScene } from './engine/boot_scene';

const gameConfig = {
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 },
        debug: false
    }
  },
  input: {
    mouse: true
  },
  scene: [BootScene, LoadScene, RoomScene]
};

var game = new Phaser.Game(gameConfig);
// game.scene.add('load', LoadScene);
// game.scene.add('room', RoomScene);
// engine = new Engine(game);