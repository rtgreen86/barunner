import Phaser from 'Phaser';

import * as Styles from '../Styles';

export default class ScoreboardScene extends Phaser.Scene {
  constructor() {
    super('ScoreboardScene');
  }

  init(data) {
    this.game = this.scene.get(data.game);
  }

  create() {
    this.distanceText = this.add.text(0, 0, '', Styles.uiText);
    this.beatsText = this.add.text(350, 0, '', Styles.uiText);

    this.game.events.on('changedata-beats', (gameObject, value) => {
      this.beatsText.setText('Beats: ' + value);
    });

    this.button = this.add.image(300, 100, 'button-green').setScrollFactor(0, 0);
    this.buttonText = this.add.text(300, 100, 'Menu Menu', Styles.buttonText).setScrollFactor(0, 0).setOrigin(0.5, 0.5);

    this.button1 = this.add.image(500, 100, 'button-x').setScrollFactor(0, 0);

    this.button1.setInteractive();


    this.button1.on('pointerdown',  () => {
      this.button1.setTint(0x999999);
      this.down = true;
    });

    this.button1.on('pointerout', () => {
        this.button1.clearTint();
        this.down = false;
    });

    this.button1.on('pointerup', () => {
        this.button1.clearTint();
        if (this.down) {
          this.debugScene = this.scene.get('DebugScene');
          this.debugScene.log('Event click');
          this.scene.run('MenuScene', { game: 'GameScene' });
          this.scene.pause('GameScene');
        }
        this.down = false;
    });

    this.anims.createFromAseprite('switch');
    this.anims.get('blink').repeat = -1;
    this.switch = this.add.sprite(130, 100, 'switch', 0);
    this.switch.play('blink');
  }

  update() {
    const distanceInMeters = Math.floor(this.game.data.get('distance'));
    const distanceInKilometers = Math.floor(distanceInMeters / 10) / 100;
    if (distanceInMeters < 1000) {
      this.distanceText.setText('Distance: ' + distanceInMeters + ' m');
    } else {
      this.distanceText.setText('Distance: ' + distanceInKilometers.toFixed(2) + ' km');
    }
  }


}