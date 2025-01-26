import Phaser from 'phaser';
import { SceneKey } from '../resources';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super(SceneKey.GameoverScene);
  }

  create() {
    const { width, height } = this.scale;
    const x = width * 0.5;
    const y = height * 0.5;

    this.add.text(x, y, 'Press SPACE to Play Again', {
      fontSize: '32px',
      color: '#FFFFFF',
      backgroundColor: '#000000',
      shadow: { fill: true, blur: 0, offsetY: 0 },
      padding: { left: 15, right: 15, top: 10, bottom: 10 }
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', this.handleSpacePressed, this);
  }

  private handleSpacePressed() {
    this.scene.get(SceneKey.GameScene).events.emit('restart');
    this.scene.stop();
  }
}
