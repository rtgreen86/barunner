import { Game, AUTO, } from 'Phaser';
import GameScene from './scenes/GameScene';

import './main.css';

const scene = new GameScene('game');

window.game = new Game({
  type: AUTO,
  width: 800,
  height: 600,
  scene,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { x: 0, y: 2000 }
    }
  }
});
