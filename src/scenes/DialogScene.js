import { Scene } from 'phaser';

export default class DialogScene extends Scene {
  constructor() {
    super('DialogScene');
  }

  init(arg) {
    // super.init(arg);
    console.log('init', this.data);
    console.log('init', 'argument', JSON.stringify(arg));
    console.log('init', 'settings', JSON.stringify(this.settings));
  }

  create() {
    this.shade = this.add.graphics().fillStyle(0x000000, 0.5).fillRect(0, 0, 1280, 720);

    const buttonTextStyle = {font: '32px Arial', color: '#ffffff'};

    this.xButton = this.add.baButton(175, 75 * 7, 'button-x', 0).setScale(0.5, 0.5);

    const dialog = this.add.image(640, 360, 'dialog_bg').setScale(0.37).setAngle(90);
    this.add.image(640, 360, 'dialog_frame').setScale(0.37).setAngle(90);

    const styles = {font: '54px Arial', color: '#6E4816'};

    this.add.text(640, 90, 'Баранер', {font: '72px Arial', color: '#6E4816'}).setOrigin(0.5);

    this.add.graphics().fillStyle(0x6E4816, 1).fillRect(640 - 180, 90 + (72 / 2) + 5, 360, 5);

    const menuItem1 = this.add.baMenuItem(640, 90 + 72 + 54 + 27, 'Сначала', styles).on('click', () => {
      console.log('Сначала clicked');
    });

    const menuItem2 = this.add.baMenuItem(640, 90 + 72 + (54 + 27) * 2, 'Продолжить', styles);

    const menu = this.add.baMenu('switch-animated', 'Indicate');

    menu.setScale(0.25).setOrigin(1.1, 0.5).add(menuItem1).add(menuItem2).setActive(menuItem2);

    const dialogX = dialog.x + ((dialog.height * dialog.scale) / 2) - 175;
    const dialogY = dialog.y + ((dialog.width * dialog.scale) / 2) - 75;

    this.greenButton = this.add.baButton(dialogX, dialogY, 'button-green', 0).setScale(0.4).on('click', () => {
      console.log('Так! Clicked.');
    });
    const dialogX2 = dialogX - this.greenButton.width * this.greenButton.scale;
    this.redButton = this.add.baButton(dialogX2, dialogY, 'button-red', 0).setScale(0.4);

    console.log(dialog.width);


    this.add.text(this.greenButton.x, this.greenButton.y, 'Так!', buttonTextStyle).setOrigin(0.5, 0.8);
    this.add.text(this.redButton.x, this.redButton.y, 'Ні', buttonTextStyle).setOrigin(0.5, 0.8);
    this.add.text(175, 72 * 5, 'Hello World', buttonTextStyle).setOrigin(0.5, 0.5);
  }
}
