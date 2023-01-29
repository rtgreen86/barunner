import Phaser from 'Phaser';

import Button from '../entities/Button';

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

    const width = this.game.game.config.width;
    this.add.existing(new Button(this, width - 64, 64, 'button-x'))
      .setStyle('yellowButton')
      .on('click', () => {
        this.scene.run('MenuScene', { game: 'GameScene' });
        this.scene.pause('GameScene');
        this.scene.sleep('ScoreboardScene');
      });


    this.add.existing(new Button(this, width - 258, 64, 'button-x'))
      .setStyle('redButton')
      .on('click', () => {
        const dbg = this.scene.get('DebugScene');
        dbg.log('click1');
        const gameScene = this.scene.get('GameScene');
        gameScene.events.emit('myEvent');
        dbg.log('click2');
      });
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