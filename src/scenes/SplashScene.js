import Phaser from 'phaser';

import FILE_SPLASH from '../../assets/images/splash.jpg';

export default class SplashScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SplashScene', active: true });
  }

  preload() {
    this.load.image('splash-image', FILE_SPLASH);
  }

  create() {
    this.add.image(0, 0, 'splash-image').setOrigin(0, 0);
  }
}
