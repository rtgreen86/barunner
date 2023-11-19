import * as Phaser from 'phaser';
import Button from "./GameObjects/Button";
import MenuItem from './GameObjects/MenuItem';
import Marker from './GameObjects/Marker';
import Menu from './GameObjects/Menu';

export default class UIPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager);

    pluginManager.registerGameObject('baButton', function (x, y, texture, frame) {
      return this.displayList.add(new Button(this.scene, x, y, texture, frame));
    });

    pluginManager.registerGameObject('baMenuItem', function (x, y, text, style) {
      return this.displayList.add(new MenuItem(this.scene, x, y, text,style));
    });

    pluginManager.registerGameObject('baMarker', function (x, y, texture, frameOrAnimationName, animationName) {
      return this.displayList.add(new Marker(this.scene, x, y, texture, frameOrAnimationName, animationName));
    });

    pluginManager.registerGameObject('baMenu', function (texture, frameOrAnimationName, animationName) {
      return this.updateList.add(new Menu(this.scene, texture, frameOrAnimationName, animationName));
    });
  }
}
