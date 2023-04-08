import Phaser from "phaser";
import UIButton from "./UIButton";

export default class UIPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager);
    pluginManager.registerGameObject('UIButton', this.createButton);
  }

  createButton(x, y) {
    return this.displayList.add(new UIButton(this.scene, x, y));
  }
}
