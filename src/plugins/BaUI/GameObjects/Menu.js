import Phaser from 'phaser';

export const DIRECTION_UP = 'up';

export const DIRECTION_DOWN = 'down';

export default class Menu extends Phaser.GameObjects.GameObject {
  static DIRECTION_UP = DIRECTION_UP;

  static DIRECTION_DOWN = DIRECTION_DOWN;

  #controls = [];

  #marker;

  #active;

  constructor(scene, texture, frameOrAnimationName, animationName) {
    super(scene, 'menu');

    this.#marker = scene.add.baMarker(0, 0, texture, frameOrAnimationName, animationName);

    this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP, true, false).on('down', this.#handleUpPressed, this);
    this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN, true, false).on('down', this.#handleDownPressed, this);
    this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER, true, false).on('down', this.#handleEnterPressed, this);
  }

  get length() {
    return this.#controls.length;
  }

  set length(value) {
    this.#controls.length = value;
  }

  add(gameObject) {
    gameObject.on('activating', this.#handleItemActivating, this);
    gameObject.on('click', this.#handleItemClick, this);
    this.#controls.push(gameObject);
    return this;
  }

  moveMarker(direction) {
    let index = this.#controls.indexOf(this.#active);

    if (direction === DIRECTION_UP) index--;
    if (direction === DIRECTION_DOWN) index++;
    if (index < 0) index = this.length - 1;
    if (index === this.length) index = 0;

    this.setActive(this.#controls[index]);

    return this;
  }

  preUpdate() {

  }

  setActive(gameObject) {
    if (!gameObject) gameObject = this.#controls[0];
    if (!gameObject) return;
    this.#marker.setPosition(gameObject);
    this.#active = gameObject;
    return this;
  }

  setScale(x, y) {
    this.#marker.setScale(x, y);
    return this;
  }

  setOrigin(x, y) {
    this.#marker.setOrigin(x, y);
    return this;
  }

  #handleUpPressed() {
    this.moveMarker(DIRECTION_UP);
  }

  #handleDownPressed() {
    this.moveMarker(DIRECTION_DOWN);
  }

  #handleEnterPressed() {
    if (this.#active) {
      this.#active.emit('click', this.#active);
    }
  }

  #handleItemActivating(gameObject) {
    this.setActive(gameObject);
  }

  #handleItemClick(gameObject) {
    this.emit('click', gameObject);
  }
}
