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
    this.beatsText = this.add.text(350, 0, '', {
      font: '32px Arial', color: '#ffffff',
      shadow: { offsetX: 2, offsetY: 2, fill: '#000000' }
    });

    this.game.events.on('changedata-beats', (gameObject, value) => {
      this.beatsText.setText('Beats: ' + value);
    });

    this.button = this.add.image(300, 100, 'button-green').setScrollFactor(0, 0);
    this.buttonText = this.add.text(300, 100, 'Menu Menu', {
      font: '32px Arial', color: '#ffffff',
      // shadow: { offsetX: 2, offsetY: 2, fill: '#000000' }
    }).setScrollFactor(0, 0).setOrigin(0.5, 0.5);

    this.button = this.add.image(500, 100, 'button-x').setScrollFactor(0, 0);
    // this.switch = this.add.image(130, 100, 'switch').setScrollFactor(0, 0);
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