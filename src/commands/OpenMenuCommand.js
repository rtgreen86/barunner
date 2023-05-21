export default class OpenMenuCommand {
  constructor(scene) {
    this.scene = scene;
  }

  execute() {
    this.scene.scene.run('MenuScene', { game: 'GameScene' });
    this.scene.scene.pause('GameScene');
    this.scene.scene.sleep('ScoreboardScene');
  }
}