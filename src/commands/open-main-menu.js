export default class OpenMainMenu {
  constructor(scene) {
    this.scene = scene;
  }

  execute() {
    this.scene.sleep('ScoreboardScene');
    this.scene.sleep('virtual-gamepad-scene');
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
