import Phaser from 'Phaser';

import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
import DebugScene from './scenes/DebugScene';

import './main.css';

window.game = new Phaser.Game({
  type: Phaser.WEBGL,
  scene: [BootScene, GameScene, DebugScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { x: 0, y: 2000 }
    }
  },
  scale: {
    width: 1280,
    height: 720,
    mode: Phaser.Scale.FIT,
    min: {
      width: 320,
      height: 180
    },
    max: {
      width: 1280,
      height: 720
    }
  }
});
