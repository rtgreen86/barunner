import * as Phaser from "phaser";
import UIButton from "./UIButton";
import UITextButton from "./UIButtonContainer";

export default class UIPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);

    pluginManager.registerGameObject('UIButton', function (x: number, y: number, texture: string, frame: number) {
      return this.displayList.add(new UIButton(this.scene, x, y, texture, frame))
    });

    pluginManager.registerGameObject('UITextButton', function (x: number, y: number, text: string, texture: string, frame: number) {
      return this.displayList.add(new UITextButton(this.scene, x, y, text, texture, frame));
    });
  }
}
