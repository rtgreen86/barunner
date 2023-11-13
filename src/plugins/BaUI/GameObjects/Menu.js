import Phaser from 'phaser';

export default class Menu extends Phaser.GameObjects.GameObject {
  #controls = new Set();

  #marker;

  constructor(scene, texture, frameOrAnimationName, animationName) {
    super(scene, 'menu');
    this.#marker = scene.add.baMarker(0, 0, texture, frameOrAnimationName, animationName);
  }

  get length() {
    return this.#controls.size;
  }

  set length(value) {
    this.#controls.length = value;
  }

  add(gameObject) {
    this.#controls.add(gameObject);
    return this;
  }

  remove(gameObject) {
    this.#controls.remove(gameObject);
    return this;
  }

  setActive(gameObject) {
    this.#marker.setPosition(gameObject);
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
}
