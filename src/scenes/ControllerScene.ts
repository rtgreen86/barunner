import Phaser from 'phaser';
import { SceneKey } from '../enums';
import { OpenMainMenu } from '../commands';


export interface Controller {
  readonly isActionDown: boolean;
  readonly actionDownDuration: number;
}

export default class ControllerScene
  extends Phaser.Scene
  implements Controller
{
  private cursor?: Phaser.Types.Input.Keyboard.CursorKeys;

  private isGameObjectOver = false;

  private enabled = true;

  private xButton!: Phaser.GameObjects.Image;

  constructor() {
    super(SceneKey.ControllerScene);
  }

  get isActionDown() {
    // console.log(this.input.activePointer.isDown)
    return this.cursor?.space.isDown || this.isPointerDown || false;
  }

  get actionDownDuration() {
    if (this.cursor?.space.isDown) {
      return this.cursor.space.getDuration();
    }
    if (this.isPointerDown) {
      return this.input.activePointer.getDuration();
    }
    return 0;
  }

  get isPointerDown() {
    // TODO: delete one of this method

    // Method I
    return !this.isGameObjectOver && this.input.activePointer.isDown;

    // Method II
    // const isOver = this.input.hitTestPointer(this.input.activePointer).length !== 0;
    // return !isOver && this.input.activePointer.isDown
  }

  create() {
    // use Phaser.Input.Keyboard. KeyboardPlugin
    // doc: https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.KeyboardPlugin.html
    // An object containing the properties: up, down, left, right, space and shift.
    this.cursor = this.input?.keyboard?.createCursorKeys();

    this.xButton = this.createXButton();
    this.subscribe();
  }

  update() {
    // this.sensorGamepad.setDisabled(this.input.hitTestPointer(this.input.activePointer).length !== 0);
  }

  subscribe() {
    this.input.on('gameobjectover', this.handleGameObjectOver, this);
    this.input.on('gameobjectout', this.handleGameObjectOut, this);
    this.xButton.on('click', this.handleXClick, this);
    this.events.on('destroy', this.handleDestroy, this);
  }

  unsubscribe() {
    this.input.off('gameobjectover', this.handleGameObjectOver);
    this.input.off('gameobjectout', this.handleGameObjectOut);
    this.xButton.off('click', this.handleXClick);
    this.events.off('destroy', this.handleDestroy);
  }

  createXButton() {
    const texture = this.textures.get('button-x').get();
    const scale = 0.5;
    const x = 1280 - texture.width * scale / 2;
    const y = texture.height * scale / 2;
    return (this.add as any).baButton(x, y, 'button-x', 0).setScale(scale); // TODO: fix type
  }

  private handleGameObjectOver() {
    this.isGameObjectOver = true;
  }

  private handleGameObjectOut() {
    this.isGameObjectOver = false;
  }

  private handleXClick() {
    new OpenMainMenu(this.scene).execute();
  }

  private handleDestroy() {
    this.unsubscribe();
  }
}
