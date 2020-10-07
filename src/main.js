import { Game, AUTO } from 'Phaser';
import GameScene from './scenes/GameScene';

const scene = new GameScene();

new Game({
  type: AUTO,
  width: 1024,
  height: 600,
  scene,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: {
        x: 0,
        y: 500
      }
    }
  }
});
