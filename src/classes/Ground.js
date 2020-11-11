import { Physics } from 'Phaser';

export default class Ground extends Physics.Arcade.StaticGroup {
  constructor(scene) {
    super(
      scene.physics.world,
      scene
    );
    this.scene = scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    this.add(this.scene.physics.add.staticImage(0, 560, 'image-ground'));
    this.add(this.scene.physics.add.staticImage(200, 560, 'image-ground'));
    this.add(this.scene.physics.add.staticImage(400, 560, 'image-ground'));
    this.add(this.scene.physics.add.staticImage(600, 560, 'image-ground'));

    this.lastGround = 800;
  }

  update() {
    this.killChunks();
    this.resurrectChunks();
  }

  resurrectChunks() {
    let unusedGround = this.getFirstDead(false, this.lastGround, 560);
    while (unusedGround) {
      this.lastGround += 200;
      unusedGround.setActive(true);
      unusedGround.setVisible(true);
      unusedGround.refreshBody();
      unusedGround = this.getFirstDead(false, this.lastGround, 560);
    }
  }

  killChunks() {
    const groundItems = this.getChildren();
    for (let i = 0; i < groundItems.length; i++) {
      if (groundItems[i].x < this.scene.deadline) {
        groundItems[i].setActive(false);
        groundItems[i].setVisible(false);
      }
    }
  }
}
