import Phaser from 'phaser';
import * as Styles from '../Styles';

export default class ScoreboardScene extends Phaser.Scene {
  constructor() {
    super('ScoreboardScene');
  }

  init() {
    this.gameScene = this.scene.get('GameScene');
  }

  create() {
    // const width = this.gameScene.game.config.width;

    this.add.text(0, 0, '', Styles.uiText).setName('DistanceText');
    this.add.text(350, 0, '', Styles.uiText).setName('BeatsText');

    this.gameScene.events.on('changedata-beats', this.handleBeatsChanged, this);
    this.events.once('shutdown', this.handleShutdown, this);
  }

  update() {
    const distanceInMeters = Math.floor(this.gameScene.data.get('distance'));
    const distanceInKilometers = Math.floor(distanceInMeters / 10) / 100;
    const text = this.children.getByName('DistanceText');
    if (distanceInMeters < 1000) {
      text.setText('Distance: ' + distanceInMeters + ' m');
    } else {
      text.setText('Distance: ' + distanceInKilometers.toFixed(2) + ' km');
    }
  }

  handleBeatsChanged(gameObject, value) {
    this.children.getByName('BeatsText').setText('Beats: ' + value);
  }

  handleShutdown() {
    this.gameScene.events.off('changedata-beats', this.handleBeatsChanged, this);
  }
}
