import { Scene } from 'phaser';

const buttonTextStyle = {font: '32px Arial', color: '#ffffff'};

export default class DialogScene extends Scene {
  constructor() {
    super('DialogScene');
  }

  create(data = {}) {
    const message = data.message || '';

    const captionOK = data.captionOK || 'OK';

    const captionCancel = data.captionCancel || 'Cancel';

    const handleOK = data.onOK || noop;

    const handleCancel = data.onCancel || noop;

    const context = data.context || this;

    this.add.graphics().fillStyle(0x000000, 0.5).fillRect(0, 0, 1280, 720);

    this.add.image(640, 360, 'dialog_bg').setScale(0.37).setAngle(90);

    this.add.text(640, 350, message, {font: '36px Arial', color: '#6E4816'}).setOrigin(0.5, 3);

    this.add.image(640, 360, 'dialog_frame').setScale(0.37).setAngle(90);

    const buttonOK = this.add.baButton(460, 560, 'button-green', 0)
      .setScale(0.4)
      .on('click', this.handleButtonClick, this)
      .on('click', handleOK, context);

    const buttonCancel = this.add.baButton(820, 560, 'button-red', 0)
      .setScale(0.4)
      .on('click', this.handleButtonClick, this)
      .on('click', handleCancel, context);

    this.add.text(buttonOK.x, buttonOK.y, captionOK, buttonTextStyle).setOrigin(0.5, 0.8);

    this.add.text(buttonCancel.x, buttonCancel.y, captionCancel, buttonTextStyle).setOrigin(0.5, 0.8);
  }

  handleButtonClick() {
    this.scene.stop();
  }
}

const noop = () => {};
