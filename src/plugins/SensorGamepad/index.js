import Phaser from 'phaser';

export default class SensorGamepad extends Phaser.Plugins.BasePlugin {
  enabled = true;

  get isADown() {
    return this.enabled && this.game.input.activePointer.isDown;
  }

  setDisabled(value) {
    return this.setEnabled(!value);
  }

  setEnabled(value) {
    this.enabled = value;
    return this;
  }
}
