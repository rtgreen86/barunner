import Phaser from "phaser";
import UIButton from "./UIButton";
import UITextButton from "./UITextButton";

export default class UIPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager);
    pluginManager.registerGameObject('UIButton', this.createButton);
    pluginManager.registerGameObject('UITextButton', this.createTextButton);
  }

  createButton(x, y, texture, frame) {
    return this.displayList.add(new UIButton(this.scene, x, y, texture, frame));
  }

  createTextButton(x, y, text, texture, frame) {
    return this.displayList.add(new UITextButton(this.scene, x, y, text, texture, frame));
  }
}
