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

import * as CONST from './const'

new Phaser.Game({
  title: 'Barunner',
  version: packageJson.version,
  type: Phaser.AUTO,
  scene: [SplashScene, BootScene, GameScene, ScoreboardScene, MenuScene, ConfirmScene, DialogScene, MainMenuScene, VirtualGamepadScene, DebugScene, RestartScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { x: CONST.WORLD.GRAVITY_X, y: CONST.WORLD.GRAVITY_Y }
    }
  },
  plugins: {
    global: [
      { key: 'BaUI', plugin: BaUI, start: true },
      { key: 'SensorGamepad', plugin: SensorGamepad, start: false, mapping: 'sensorGamepad' }
    ]
  },
  scale: {
    width: CONST.VIEWPORT.WIDTH,
    height: CONST.VIEWPORT.HEIGHT,
    mode: Phaser.Scale.FIT,
    min: {
      width: CONST.VIEWPORT.MIN_WIDTH,
      height: CONST.VIEWPORT.MIN_HEIGHT
    },
    max: {
      width: CONST.VIEWPORT.MAX_WIDTH,
      height: CONST.VIEWPORT.MAX_HEIGHT
    }
  }
});
