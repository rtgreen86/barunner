import Phaser from 'phaser';
import { ObjectsFrame } from '../resources';
import { SPRITESHEET_OBJECTS, ANIMATION_KEY } from '../const';

export default class Obstacle extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Sprite;

  private effect: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.sprite = scene.add.sprite(0, 0, SPRITESHEET_OBJECTS, ObjectsFrame.ROCK_1);
    this.sprite.setPosition(0, -32);
    this.add(this.sprite);

    this.effect = scene.add.sprite(0, 0, SPRITESHEET_OBJECTS);
    this.effect.play(ANIMATION_KEY.YELLOW_STARS);
    this.add(this.effect);

    scene.physics.add.existing(this, true);

    this.fixBodyPosition();
    this.runEffect(false);
  }

  runEffect(enabled: boolean) {
    this.effect.setVisible(enabled);
  }

  update() {
    // You can call this.runEffect(true) here
    // to start effect
  }

  move(x: number) {
    this.x = x;
    this.fixBodyPosition();
  }

  private fixBodyPosition() {
    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(64, 64);
    body.position.x = this.x - 32;
    body.position.y = this.y - 48;
  }
}
