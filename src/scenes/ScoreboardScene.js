import Phaser from 'Phaser';

export default class ScoreboardScene extends Phaser.Scene {
  constructor() {
    super('ScoreboardScene');
  }

  init(data) {
    this.game = this.scene.get(data.game);
  }

  create() {
    this.distanceText = this.add.text(0, 0, '', {
      font: '32px Arial', color: '#ffffff',
      shadow: { offsetX: 2, offsetY: 2, fill: '#000000' }
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