import * as Phaser from 'phaser';
import Button from "./GameObjects/Button";
import MenuItem from './GameObjects/MenuItem';

export default class UIPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager);

    pluginManager.registerGameObject('baButton', function (x, y, texture, frame) {
      return this.displayList.add(new Button(this.scene, x, y, texture, frame));
    });

    pluginManager.registerGameObject('ba_menuItem', function (x, y, text, style) {
      return this.displayList.add(new MenuItem(this.scene, x, y, text,style));
    });


  }
}
