import Phaser from 'phaser';

export default class Marker extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frameOrAnimationName, animationName) {
    if (typeof frameOrAnimationName === 'string') {
      animationName = frameOrAnimationName,
      frameOrAnimationName = null;
    }

    super(scene, x, y, texture, frameOrAnimationName);

    if (animationName) this.play(animationName);
  }

  setPosition(gameObjectOrX, y, z, w) {
    let x;

    if (typeof gameObjectOrX === 'number') {
      x = gameObjectOrX;
    }

    if (typeof gameObjectOrX === 'object') {
      x = gameObjectOrX.x - (gameObjectOrX.width / 2);
      y = gameObjectOrX.y;
    }

    return super.setPosition(x, y, z, w);
  }
}
