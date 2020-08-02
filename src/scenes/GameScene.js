import Phaser from 'Phaser';
import StaticSheep from '../../assets/static-sheep.png';
import Tileset from '../../assets/tileset32.png';
import bg13 from '../../assets/13.png';
import Ground from '../../assets/ground.png';
import Sheep from '../../assets/black-sheep-idle.png';
import Background from '../../assets/background.png';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game')
  }

  preload () {
    this.load.image('ground', Ground);
    this.load.spritesheet('sheep', Sheep, {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image('static-sheep', StaticSheep);
    this.load.image('tileset32', Tileset)
    this.load.tilemapTiledJSON('map', 'map.json');
    this.load.image('bg13', bg13);
    this.load.image('background', Background);
  }

  create () {
    // level background
    this.background1 = this.add.image(0, 0, 'background');
    this.background1.setOrigin(0);
    this.background1.setScrollFactor(0);

    // old tile map
    // TODO: delete

    this.map = this.add.tilemap('map');
    this.terrain = this.map.addTilesetImage('tiles', 'tileset32');
    this.background = this.map.createStaticLayer('Background', [this.terrain], 0, 0);
    this.layer = this.map.createStaticLayer('Tile Layer 1', [this.terrain], 0, 0);
    this.background.setScrollFactor(0.3);

    // Dynamic generated map

    this.ground = this.physics.add.staticGroup();
    for (let i = 0; i < 3; i++) {
      const tile = this.physics.add.staticImage(i * 200, 500, 'ground');
      tile.setOrigin(0.5, 0.8);
      tile.setImmovable();
      this.ground.add(tile);
    }

    // TODO: cleanup
    // this.layer.setCollisionByProperty({ collide: true });
    // this.layer.setCollision([]);
    // this.layer.setCollisionByExclusion([14]);
    // this.layer.setCollisionBetween(1, 50);

    this.layer.setCollisionByExclusion(-1, true);
    this.staticSheep = this.physics.add.image(64, 400, 'sheep');
    this.physics.add.collider(this.staticSheep, this.layer);

    this.physics.add.collider(this.staticSheep, this.ground);

    this.cameras.main.startFollow(
      this.staticSheep,
      false,
      .9,
      .9,
      -300,
      200
    );
    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.staticSheep.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update () {
    this.staticSheep.body.setVelocityX(0);
    if (this.cursors.left.isDown) {
      this.staticSheep.body.setVelocityX(-600);
    } else if (this.cursors.right.isDown) {
      this.staticSheep.body.setVelocityX(600);
    }
  }

  init () {
    /* do nothing */
  }

}
