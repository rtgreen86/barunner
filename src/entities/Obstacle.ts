import Phaser from 'phaser';
import { TextureKeys, AnimationKeys, SpritesheetKeys } from '../const';

export default class Obstacle extends Phaser.GameObjects.Container {
  private effect: Phaser.GameObjects.Sprite;

  private cursor: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    const rock = scene.add.sprite(0, 0, SpritesheetKeys.Objects, 3)
      .setOrigin(0.5, 1);

    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(rock.width, rock.height);
    body.setOffset(-rock.width * 0.5, -rock.height);

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
