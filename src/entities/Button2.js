import Button from "./Button";
import * as Styles from '../Styles';

export default class Button2 extends Button {
  constructor(scene, x, y, texture, frame, caption) {
    super(scene, x, y, texture, frame, caption);

    const leftMarkerOld = this.getByName('marker-left');
    this.remove(leftMarkerOld, true, true);

    const graphics = this.scene.add.graphics();

    graphics.lineStyle(5, 0x000000, 1.0);
    graphics.beginPath();
    graphics.moveTo(-100, 25);
    graphics.lineTo(100, 25);
    graphics.closePath();
    graphics.strokePath();

    graphics.setName('marker-left');

    graphics.play = () => {};
    graphics.stop = () => {};

    graphics.setVisible(false);

    this.add(graphics);
  }

  get isFocus() {
    return super.isFocus;
  }

  set isFocus(value) {
    super.isFocus = value;
    this.getByName('marker-right')
      .setVisible(false)
      .stop();
  }

  setTextStyle(style) {
    super.setTextStyle(style);

    const graphics = this.getByName('marker-left');

    graphics.clear();
    graphics.lineStyle(5, Styles[style].color2, 1.0);
    graphics.beginPath();
    graphics.moveTo(-100, 25);
    graphics.lineTo(100, 25);
    graphics.closePath();
    graphics.strokePath();

    graphics.setName('marker-left');

    graphics.play = () => {};
    graphics.stop = () => {};

    return this;
  }

}
