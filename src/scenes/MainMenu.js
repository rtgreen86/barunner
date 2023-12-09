import Phaser from 'phaser';
import { CloseMenu } from '../commands';

const resolutionX = 1280;

const resolutionY = 720;

const headerStyle = {font: '108px Arial', color: '#FFFFFF'};

const menuItemStyles = {font: '54px Arial', color: '#FFFFFF'};

const menuX = 640;

const menuY = 300;

const menuItemHeight = 81;

export default class MainMenu extends Phaser.Scene {
  #titleText;

  #itemsCaptions;

  constructor() {
    super('MainMenu');
  }

  init(data = {}) {
    this.#titleText = data.title || '';
    this.#itemsCaptions = data.items || [];
  }

  create() {
    this.add.graphics().fillStyle(0x000000, 0.5).fillRect(0, 0, resolutionX, resolutionY);

    if (this.#titleText) this.add.text(640, 140, this.#titleText, headerStyle).setOrigin(0.5);

    const menu = this.add.baMenu('switch-animated', 'Indicate')
      .setScale(0.25).setOrigin(1.1, 0.5)
      .on('click', this.#handleMenuClick, this);

    this.#itemsCaptions.forEach((caption, index) => {
      const x = menuX;
      const y = menuY + index * menuItemHeight;
      const item = this.add.baMenuItem(x, y, caption, menuItemStyles)
      menu.add(item);
    });

    menu.setActive();
  }

  restartGame() {
    this.scene.start('DialogScene', {
      message: 'Хотите начать сначала?',
      captionOK: 'Да',
      captionCancel: 'Нет',
      context: this,
      onOK: () => {
        console.log('OK');
        this.scene.start('GameScene');
      },
      onCancel: () => {
        console.log('CANCEL');
        this.scene.run('GameScene');
      },
    });
    this.scene.stop();
  }

  #handleMenuClick(item) {
    switch (item.text) {
      case 'Продолжить':
        return new CloseMenu(this.scene).execute();
      case 'Сначала':
        return this.restartGame();
    }
  }
}
