export default class OpenMainMenu {
  constructor(scene) {
    this.scene = scene;
  }

  execute() {
    this.scene.sleep('ScoreboardScene');
    this.scene.sleep('VirtualGamepad');
    this.scene.pause('GameScene');
    this.scene.run('MainMenu', {
      title: 'Баранер',
      items: [
        'Продолжить',
        'Сначала'
      ]
    });
  }
}
