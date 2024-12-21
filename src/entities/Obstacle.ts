import Phaser from 'phaser';
import { TextureKeys, AnimationKeys, SpritesheetKeys } from '../const';

export default class Obstacle extends Phaser.GameObjects.Container {
  private effect: Phaser.GameObjects.Sprite;

  private cursor: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    const rock = scene.add.sprite(0, 0, SpritesheetKeys.Objects, 3)
      .setOrigin(0.5, 1);

    scene.physics.add.existing(this, true);


    const width = rock.displayWidth;
    const height = rock.displayHeight;

    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(width, height);
    body.setOffset(-width * 0.5, 0);

    body.position.x = this.x + body.offset.x;
    body.position.y = this.y - height;

    this.effect = scene.add.sprite(0, 0, TextureKeys.ObstaclesEffects)
      .play(AnimationKeys.OBSTACLE_EFFECT)

    this.runEffect(false);

    this.add(rock);
    this.add(this.effect);

    this.cursor = scene.input.keyboard.createCursorKeys();
  }

  runEffect(enabled: boolean) {
    this.effect.setVisible(enabled);
  }

  update() {
    if (this.cursor.space?.isDown) {
      this.runEffect(true);
    }
  }
}
