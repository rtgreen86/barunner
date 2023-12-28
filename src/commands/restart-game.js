export default class RestartGame {
  constructor(scene) {
    this.scene = scene;
  }

  execute() {
    this.scene.stop('main-menu-scene');
    this.scene.stop('GameScene');
    this.scene.start('restart-scene');
  }
}
