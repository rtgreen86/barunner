import Phaser from 'Phaser';

import SplashScene from './scenes/SplashScene';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
import DebugScene from './scenes/DebugScene';
import ScoreboardScene from './scenes/ScoreboardScene';
import MenuScene from './scenes/MenuScene';

import './main.css';

window.game = new Phaser.Game({
  title: 'Barunner',
  version: '1.1.5',
  type: Phaser.AUTO,
  scene: [SplashScene, BootScene, GameScene, DebugScene, ScoreboardScene, MenuScene],
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
