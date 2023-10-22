import {Plugins} from "phaser";
import UIButton from "./UIButton";
import UITextButton from "./UIButtonContainer";
import Button from "./GameObjects/Button";
import MenuItem from './GameObjects/MenuItem';

export default class UIPlugin extends Plugins.BasePlugin {
  constructor(pluginManager: Plugins.PluginManager) {
    super(pluginManager);

    pluginManager.registerGameObject('UIButton', function (x: number, y: number, texture: string, frame: number) {
      return this.displayList.add(new UIButton(this.scene, x, y, texture, frame))
    });

    pluginManager.registerGameObject('UITextButton', function (x: number, y: number, text: string, texture: string, frame: number) {
      return this.displayList.add(new UITextButton(this.scene, x, y, text, texture, frame));
    });

    pluginManager.registerGameObject('button', function (
      x: number,
      y: number,
      texture: string,
      frame: number
    ) {
      return this.displayList.add(new Button(this.scene, x, y, texture, frame));
    });

    pluginManager.registerGameObject('baMenuItem', function createBaText(
      x: number, y: number,
      text: string | string[],
      style: Phaser.Types.GameObjects.Text.TextStyle
    ) {
      const menuItem = new MenuItem(this.scene, x, y, text,style);
      this.displayList.add(menuItem);
      return menuItem;
    });
  }
}
