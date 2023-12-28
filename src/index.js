import Phaser from 'phaser';

import BaUI from './plugins/BaUI';
import SensorGamepad from './plugins/SensorGamepad';

import SplashScene from './scenes/SplashScene';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
import ScoreboardScene from './scenes/ScoreboardScene';
import MenuScene from './scenes/MenuScene';
import ConfirmScene from './scenes/ConfirmScene';
import DebugScene from './scenes/DebugScene';

import {
  VirtualGamepadScene,
  MainMenuScene,
  DialogScene,
  RestartScene } from './scenes';

import packageJson from '../package.json';

import './styles.css';

window.game = new Phaser.Game({
  title: 'Barunner',
  version: packageJson.version,
  type: Phaser.AUTO,
  scene: [SplashScene, BootScene, GameScene, ScoreboardScene, MenuScene, ConfirmScene, DialogScene, MainMenuScene, VirtualGamepadScene, DebugScene, RestartScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { x: 0, y: 2000 }
    }
  },
  plugins: {
    global: [
      { key: 'BaUI', plugin: BaUI, start: true },
      { key: 'SensorGamepad', plugin: SensorGamepad, start: false, mapping: 'sensorGamepad' }
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
