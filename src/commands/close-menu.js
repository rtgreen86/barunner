export default class CloseMenu {
  constructor(scene) {
    this.scene = scene;
  }

  execute() {
    this.scene.stop('MainMenu');
    this.scene.run('ScoreboardScene');
    this.scene.run('VirtualGamepad');
    this.scene.run('GameScene');
  }
}