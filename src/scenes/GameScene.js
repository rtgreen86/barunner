import Phaser from 'Phaser';

import ChunkGroup from '../entities/ChunkGroup';
import Obstacle from '../entities/Obstacle';
import Player from '../entities/Player';
import PlayerController from '../entities/PlayerController';

const SPAWN_DISTANCE = 10000;
const BACKGROUND_SPAWN_DISTANCE = SPAWN_DISTANCE * 1.5;
const GROUND_SPAWN_DISTANCE = SPAWN_DISTANCE * 1.5;

const DEADLINE_OFFSET = -500;

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
  }

  create() {
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
    })

    this.controller = new PlayerController(this);

    this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PAUSE, true, false);
    this.pauseKey.on('down', this.onPauseKeyDown, this);

    this.backgroundLayers = [
      (new ChunkGroup(this, 0, 600, 'background-layer-1', 533, 350, BACKGROUND_SPAWN_DISTANCE)).setScrollFactor(0.2, 0.2).setOrigin(0.5, 1).setDepth(-100),
      (new ChunkGroup(this, 0, 600, 'background-layer-2', 533, 350, BACKGROUND_SPAWN_DISTANCE)).setScrollFactor(0.5, 0.5).setOrigin(0.5, 1).setDepth(-50),
      (new ChunkGroup(this, 0, 600, 'background-layer-3', 1389, 350, BACKGROUND_SPAWN_DISTANCE)).setScrollFactor(1, 1).setOrigin(0.5, 1).setDepth(-25),
    ]
    this.ground = new ChunkGroup(this, 0, 562.5, 'image-ground', 200, 75, GROUND_SPAWN_DISTANCE).setDepth(-10);
    this.obstacles = this.physics.add.group();
    this.player = new Player(this, 300, 510, 'spritesheet-small', 1, this.controller).setDepth(50).setBounceX(0);


    this.physics.add.collider(this.ground, this.player);
    this.physics.add.collider(this.ground, this.obstacles);
    this.physics.add.collider(this.player, this.obstacles, null, this.onFacedObstacle, this);

    this.cameras.main.setBackgroundColor('rgba(217, 240, 245, 1)');
    this.cameras.main.startFollow(
      this.player,
      false,
      0.2, 0,
      -200, 210
    );

    this.jumpSound = this.sound.add('jump');
  }

  update(time, delta) {
    this.deadline = this.cameras.main.scrollX + DEADLINE_OFFSET;
    this.respawnObjects();
    this.player.update(time, delta);
    this.ground.update(time, delta, this.deadline);
    this.backgroundLayers.forEach(item => item.update(time, delta, this.deadline));

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
  }

  dice() {
    return Math.floor(Math.random() * 10);
  }

  spawnBigObstacle() {
    const distance = [400, 500, 540, 580, 600, 650, 700, 800, 900, 1000][this.dice()];
    this.spawnedObject += distance;
    let obstacle = this.obstacles.getFirstDead(false);
    if (!obstacle) {
      obstacle = (new Obstacle(this, this.spawnedObject, 500, 'spritesheet-large', 15)).setSize(70, 50);
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
    this.player.setY(510);
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
