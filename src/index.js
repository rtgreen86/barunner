import Phaser from 'phaser';

import BaUI from './plugins/BaUI';

import SplashScene from './scenes/SplashScene';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
import ScoreboardScene from './scenes/ScoreboardScene';
import MenuScene from './scenes/MenuScene';
import ConfirmScene from './scenes/ConfirmScene';
import DialogScene from './scenes/DialogScene';
import MainMenu from './scenes/MainMenu';
import DebugScene from './scenes/DebugScene';

import { VirtualGamepadScene } from './scenes';

import packageJson from '../package.json';

import './styles.css';

window.game = new Phaser.Game({
  title: 'Barunner',
  version: packageJson.version,
  type: Phaser.AUTO,
  scene: [SplashScene, BootScene, GameScene, ScoreboardScene, MenuScene, ConfirmScene, DialogScene, MainMenu, VirtualGamepadScene, DebugScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { x: 0, y: 2000 }
    }
  },
  plugins: {
    global: [
      { key: 'BaUI', plugin: BaUI, start: true }
    ]
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
