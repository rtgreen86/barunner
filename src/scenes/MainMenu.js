import Phaser from 'phaser';

const resolutionX = 1280;

const resolutionY = 720;

const headerStyle = {font: '108px Arial', color: '#FFFFFF'};

const menuItemStyles = {font: '54px Arial', color: '#FFFFFF'};

const menuX = 640;

const menuY = 300;

const menuItemHeight = 81;

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  init(data = {}) {
    this.titleText = data.title || '';
    this.itemsCaptions = data.items || [];
  }

  create() {
    this.shade = this.add.graphics().fillStyle(0x000000, 0.5).fillRect(0, 0, resolutionX, resolutionY);

    if (this.titleText) {
      this.title = this.add.text(640, 140, this.titleText, headerStyle).setOrigin(0.5);
    }

    this.menu = this.add.baMenu('switch-animated', 'Indicate').setScale(0.25).setOrigin(1.1, 0.5);

    this.items = this.itemsCaptions.map((caption, index) => {
      const item = this.add.baMenuItem(menuX, menuY + index * menuItemHeight, caption, menuItemStyles);
      item.on('click', this.#handleMenuClick, this);
      this.menu.add(item);
      return item;
    });

    this.menu.setActive(this.items[0]);

    this.events.on('destroy', this.#handleDestroy, this);
  }

  #handleMenuClick(item) {
    console.log(item.text);
  }

  #handleDestroy() {
    this.items.forEach(item => {
      item.off('click', this.#handleMenuClick, this);
    });
  }
}
