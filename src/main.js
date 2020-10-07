import { Game, AUTO, Scene } from 'Phaser';

const scene = new Scene('game');

new Game({
  type: AUTO,
  width: 1024,
  height: 600,
  scene,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { x: 0, y: 0 }
    }
  }
});
