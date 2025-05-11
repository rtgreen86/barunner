import { Scene } from 'phaser';

export default class Controller {
  private cursor;

  private pointer;

  private mouse;

  // private sensor;

  constructor(scene: Scene) {
    // use Phaser.Input.Keyboard. KeyboardPlugin
    // doc: https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.KeyboardPlugin.html
    // An object containing the properties: up, down, left, right, space and shift.
    this.cursor = scene.input?.keyboard?.createCursorKeys();
    this.pointer = scene.input.pointer1;
    this.mouse = scene.input.activePointer;
    // this.sensor = scene.sensorGamepad;

    // scene.input.on('pointerdown', () => {
    //   const dbg = scene.scene.get('DebugScene');
    //   dbg.log('Pointer Down');
    // })

    // const scoreboardScene = scene.scene.get('ScoreboardScene');
    // scoreboardScene.input.on('pointerdown', () => {
    //   const dbg = scene.scene.get('DebugScene');
    //   dbg.log('Scoreboard pointer down');
    // })
  }

  get isActionDown() {
    return this.cursor?.space.isDown;
    // return this.cursor?.space.isDown || this.sensor?.isADown;
  }

  getActionDuration() {
    if (this.cursor?.space.isDown) {
      return this.cursor.space.getDuration();
    }

    // if (this.sensor.isADown) {
    //   return this.sensor.getDuration();
    // }
    return 0;
  }
}
