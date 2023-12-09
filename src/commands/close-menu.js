export default class CloseMenu {
  constructor(scene) {
    this.scene = scene;
  }

  execute() {
    this.scene.stop('main-menu-scene');
    this.scene.run('ScoreboardScene');
    this.scene.run('virtual-gamepad-scene');
    this.scene.run('GameScene');
  }
}