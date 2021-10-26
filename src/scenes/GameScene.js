import Phaser from 'phaser';

import Obstacle from '../entities/Obstacle';
import Player from '../entities/Player';
import PlayerController from '../entities/PlayerController';
import BackgroundLayer from '../entities/BackgroundLayer';

const SPAWN_DISTANCE = 10000;
const GROUND_SPAWN_DISTANCE = SPAWN_DISTANCE * 1.5;

const DEADLINE_OFFSET = -100;

const PLAYER_RESPAWN_TIMEOUT = 1000;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init() {
    this.deadline = DEADLINE_OFFSET;
    this.spawnedObject = 300;
    this.paused = false;
    this.playerAlive = true;
    this.timeOfDeath = null;
    this.nextGround = 200;
  }

  create() {
    this.createAnimation();

    this.controller = new PlayerController(this);
    this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PAUSE, true, false);
    this.pauseKey.on('down', this.onPauseKeyDown, this);

    this.createBackgound();
    this.createGround();
    this.createObstacles();
    this.createPlayer();
    this.createCollaider();
    this.createCamera();
    
    this.jumpSound = this.sound.add('jump');
  }

  createCamera() {
    this.cameras.main.setBackgroundColor('rgba(217, 240, 245, 1)');
    this.cameras.main.startFollow(
      this.player,
      false,
      0.2, 0,
      -200, 210
    );
  }

  createCollaider() {
    this.physics.add.collider(this.player, this.obstacles, null, this.onFacedObstacle, this);
    this.physics.add.collider(this.ground, this.player);
    this.physics.add.collider(this.ground, this.obstacles);
  }

  createAnimation() {
    this.anims.create({
      key: 'ram-idle',
      frames: this.anims.generateFrameNumbers('spritesheet-small', { frames: [0, 1, 2, 3] }),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: 'ram-jump',
      frames: this.anims.generateFrameNumbers('spritesheet-small', { frames: [22, 23, 24, 25, 26] }),
      frameRate: 30,
      repeat: 0
    });
    this.anims.create({
      key: 'ram-fall',
      frames: this.anims.generateFrameNumbers('spritesheet-small', { frames: [27, 28] }),
      frameRate: 30,
      repeat: -1
    });
    this.anims.create({
      key: 'ram-landing',
      frames: this.anims.generateFrameNumbers('spritesheet-small', { frames: [28, 29] }),
      frameRate: 30,
      repeat: 0
    });
    this.anims.create({
      key: 'ram-run',
      frames: this.anims.generateFrameNumbers('spritesheet-small', { frames: [4, 5, 6, 7, 8, 9] }),
      frameRate: 30,
      repeat: -1
    });
    this.anims.create({
      key: 'ram-die',
      frames: this.anims.generateFrameNumbers('spritesheet-small', { frames: [18] }),
      frameRate: 30,
      repeat: 0
    });
  }

  createBackgound() {
    this.backgroundLayer1 = new BackgroundLayer(this);
    this.backgroundLayer2 = new BackgroundLayer(this);
    this.backgroundLayer3 = new BackgroundLayer(this);
    for (let i = 0; i < 5; i++) {
      this.backgroundLayer1.add(this.add.image(0, 0, 'background-layer-1').setOrigin(0.5, 1)).setScrollFactor(0.5, 1);
      this.backgroundLayer2.add(this.add.image(0, 0, 'background-layer-2').setOrigin(0.5, 1)).setScrollFactor(0.8, 1);
      this.backgroundLayer3.add(this.add.image(0, 0, 'background-layer-3').setOrigin(0.5, 1));
    }
    this.backgroundLayer1.update(5000);
    this.backgroundLayer2.update(5000);
    this.backgroundLayer3.update(5000);
  }

  createGround() {
    this.ground = this.physics.add.staticGroup({
      classType: Phaser.Physics.Arcade.StaticImage,
      name: 'ground',
      defaultKey: 'image-ground'
    }).setOrigin(0.5, 1);
    this.ground.get(0, 0).setOrigin(0.5, 1).refreshBody();
    this.ground.get(200, 0).setOrigin(0.5, 1).refreshBody();
  }

  createObstacles() {
    this.obstacles = this.physics.add.group();
  }

  createPlayer() {
    this.player = new Player(this, 250, -75 - 15, 'spritesheet-small', 1, this.controller).setDepth(50).setBounceX(0);
    this.player.setDepth(2000);
  }

  update(time, delta) {
    this.updateDeadline();
    this.respawnObjects();
    this.player.update(time, delta);

    if (this.player.isDead && !this.timeOfDeath) {
      this.timeOfDeath = time;
      this.playerAlive = false;
    }

    if (
      !this.playerAlive &&
      this.controller.isJumpDown &&
      time - this.timeOfDeath >= PLAYER_RESPAWN_TIMEOUT
    ) {
      this.respawnScene();
    }

    this.updateGround();
    this.updateBackground();
  }

  updateGround() {
    this.ground.getMatching('active', true).forEach(item => {
      if (item.x < this.deadline) {
        this.ground.kill(item);
      }
    });
    while (this.nextGround < this.deadline + GROUND_SPAWN_DISTANCE) {
      this.ground.get(this.nextGround, 0).setActive(true);
      this.nextGround += 200;
    }
    this.ground.setOrigin(0.5, 1).refresh();
  }

  dice() {
    return Math.floor(Math.random() * 10);
  }

  spawnBigObstacle() {
    const distance = [540, 580, 600, 650, 700, 700, 800, 800, 900, 1000][this.dice()];
    this.spawnedObject += distance;
    let obstacle = this.obstacles.getFirstDead(false);
    if (!obstacle) {
      obstacle = (new Obstacle(this, this.spawnedObject, -25-75, 'spritesheet-large', 15))
        .setSize(70, 50)
        .setDepth(1000);
      this.obstacles.add(obstacle);
    }
    obstacle.spawn(this.spawnedObject, -25-75);
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

  respawnScene() {
    this.player.respawn();
    this.spawnedObject = this.player.x;
    this.obstacles.children.each(obstacle => {
      obstacle.setActive(false).setVisible(false).setGravity(0);
      this.physics.world.disable(obstacle);
    });
    this.respawnObjects();
    this.playerAlive = true;
    this.timeOfDeath = null;
  }

  updateDeadline() {
    this.deadline = this.cameras.main.scrollX + DEADLINE_OFFSET;
  }

  updateBackground() {
    this.backgroundLayer1.update(this.deadline);
    this.backgroundLayer2.update(this.deadline);
    this.backgroundLayer3.update(this.deadline);
  }

  onPauseKeyDown() {
    if (!this.paused) {
      this.paused = true;
      this.player.idle();
    } else {
      this.paused = false;
      this.player.run();
    }
  }

  onFacedObstacle(player, obstacle) {
    const { x: px, y: py } = player.getBottomRight();
    const { x: ox, y: oy} = obstacle.getTopLeft();
    const side = py - oy >= px - ox;
    if (side) {
      player.die();
    }
    return true;
  }
}
