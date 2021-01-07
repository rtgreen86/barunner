import { Scene } from 'Phaser';

import backgroundLayer1 from '../../assets/images/background-layer-1.png'
import backgroundLayer2 from '../../assets/images/background-layer-2.png'
import backgroundLayer3 from '../../assets/images/background-layer-3.png'

import spritesheet from '../../assets/images/spritesheet.png';
import ground from '../../assets/images/ground.png';

import Player from '../classes/Player';
import ChunkGroup from '../classes/ChunkGroup';
import Obstacle from '../classes/Obstacle';

const SPAWN_DISTANCE = 10000;
const BACKGROUND_SPAWN_DISTANCE = SPAWN_DISTANCE * 1.5;
const GROUND_SPAWN_DISTANCE = SPAWN_DISTANCE * 1.5;

const DEADLINE_OFFSET = -500;

export default class GameScene extends Scene {
  constructor() {
    super('game');
    this.deadline = DEADLINE_OFFSET;
    this.onKeyPressed = this.onKeyPressed.bind(this);
  }

  preload() {
    this.load.image('background-layer-1', backgroundLayer1);
    this.load.image('background-layer-2', backgroundLayer2);
    this.load.image('background-layer-3', backgroundLayer3);
    this.load.image('image-ground', ground);
    this.load.spritesheet('spritesheet-50', spritesheet, {
      frameWidth: 50,
      frameHeight: 50,
      startFrame: 0,
      endFrame: 79
    });
    this.load.spritesheet('spritesheet-100', spritesheet, {
      frameWidth: 100,
      frameHeight: 100,
      startFrame: 20,
      endFrame: 79
    });
  }

  init() {
    this.spawnedObject = 300;
  }

  create() {
    this.anims.create({
      key: 'ram-idle',
      frames: this.anims.generateFrameNumbers('spritesheet-50', { frames: [1, 2, 3, 4] }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'ram-jump',
      frames: this.anims.generateFrameNumbers('spritesheet-50', { frames: [28, 29, 30, 31, 32] }),
      frameRate: 20,
      repeat: 0
    });
    this.anims.create({
      key: 'ram-fall',
      frames: this.anims.generateFrameNumbers('spritesheet-50', { frames: [33, 34] }),
      frameRate: 20,
      repeat: 0
    });
    this.anims.create({
      key: 'ram-landing',
      frames: this.anims.generateFrameNumbers('spritesheet-50', { frames: [35] }),
      frameRate: 20,
      repeat: 0
    });
    this.anims.create({
      key: 'ram-run',
      frames: this.anims.generateFrameNumbers('spritesheet-50', { frames: [6, 7, 8, 9, 10, 11] }),
      frameRate: 20,
      repeat: -1
    });

    // use Phaser.Input.Keyboard. KeyboardPlugin
    // doc: https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.KeyboardPlugin.html
    // An object containing the properties: up, down, left, right, space and shift.
    this.cursor = this.input.keyboard.createCursorKeys();

    this.backgroundLayers = [
      (new ChunkGroup(this, 0, 600, 'background-layer-1', 533, 350, BACKGROUND_SPAWN_DISTANCE)).setScrollFactor(0.2, 0.2).setOrigin(0.5, 1).setDepth(-100),
      (new ChunkGroup(this, 0, 600, 'background-layer-2', 533, 350, BACKGROUND_SPAWN_DISTANCE)).setScrollFactor(0.5, 0.5).setOrigin(0.5, 1).setDepth(-50),
      (new ChunkGroup(this, 0, 600, 'background-layer-3', 1389, 350, BACKGROUND_SPAWN_DISTANCE)).setScrollFactor(1, 1).setOrigin(0.5, 1).setDepth(-25),
    ]
    this.ground = new ChunkGroup(this, 0, 562.5, 'image-ground', 200, 75, GROUND_SPAWN_DISTANCE).setDepth(-10);
    this.obstacles = this.physics.add.group();
    this.player = new Player(this, 300, 510, 'spritesheet-50', 1, this.cursor).setDepth(50).setBounceX(0);

    this.physics.add.collider(this.ground, this.player);
    this.physics.add.collider(this.ground, this.obstacles);
    this.physics.add.collider(this.player, this.obstacles);

    this.cameras.main.setBackgroundColor('rgba(217, 240, 245, 1)');
    this.cameras.main.startFollow(
      this.player,
      false,
      0.2, 0,
      -200, 207,5
    );

    this.input.keyboard.on('keydown', this.onKeyPressed);
  }

  update(time, delta) {
    this.deadline = this.cameras.main.scrollX + DEADLINE_OFFSET;
    this.respawnObjects();
    this.player.update(time, delta);
    this.ground.update(time, delta, this.deadline);
    this.backgroundLayers.forEach(item => item.update(time, delta, this.deadline));
  }

  dice() {
    return Math.floor(Math.random() * 10);
  }

  spawnBigObstacle() {
    const distance = [400, 500, 540, 580, 600, 650, 700, 800, 900, 1000][this.dice()];
    this.spawnedObject += distance;
    let obstacle = this.obstacles.getFirstDead(false);
    if (!obstacle) {
      obstacle = (new Obstacle(this, this.spawnedObject, 500, 'spritesheet-100', 25)).setSize(70, 50);
      this.obstacles.add(obstacle);
    }
    obstacle.spawn(this.spawnedObject, 500);
  }

  killDeadlineCrossed() {
    this.obstacles.children.each(obstacle => {
      if (obstacle.x < this.deadline) {
        obstacle.setActive(false).setVisible(false).setGravity(0);
        this.physics.world.disable(obstacle);
      }
    });
  }

  respawnObjects() {
    this.killDeadlineCrossed();
    while (this.spawnedObject < this.deadline + SPAWN_DISTANCE) {
      this.spawnBigObstacle();
    }
  }

  onKeyPressed({ code }) {
    if (code === 'Pause') {
      this.paused = true;
      this.player.stop();
    }
  }

}
