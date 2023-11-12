import Phaser from 'phaser';

export default class Marker extends Phaser.GameObjects.Sprite {
  #animationName;

  constructor(scene, x, y, texture, frameOrAnimationName, animationName) {
    if (typeof frameOrAnimationName === 'string') {
      animationName = frameOrAnimationName,
      frameOrAnimationName = null;
    }

    super(scene, x, y, texture, frameOrAnimationName);

    if (animationName) this.play(animationName);
  }
}
