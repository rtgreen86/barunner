import Phaser from 'Phaser';

import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';

import './main.css';

window.game = new Phaser.Game({
  type: Phaser.AUTO,
  scene: [BootScene, GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { x: 0, y: 2000 }
    }
  },
  scale: {
    width: 1024,
    height: 600,
    mode: Phaser.Scale.FIT,
    min: {
      width: 512,
      height: 300
    },
    max: {
      width: 1024,
      height: 600
    }
  }
});
