import Phaser from 'Phaser';

import Obstacle from '../entities/Obstacle';
import Player from '../entities/Player';
import PlayerController from '../entities/PlayerController';
// import BackgroundLayer from '../entities/BackgroundLayer';

import Level1 from '../entities/levels/Level1';

const PLAYER_SIZE = 128;
const PLAYER_CAMERA_POSITION_X = -0.25;
const PLAYER_CAMERA_POSITION_Y = 0.25;

// const SPAWN_DISTANCE = 10000;
// const GROUND_SPAWN_DISTANCE = SPAWN_DISTANCE * 1.5;

const DEADLINE_OFFSET = -100;

const PLAYER_RESPAWN_TIMEOUT = 1000;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init() {
    this.deadline = DEADLINE_OFFSET;
    this.spawnedObject = 500;
    this.paused = false;
    this.playerAlive = true;
    this.timeOfDeath = null;
    this.nextGround = 200;
  }

  create() {
    this.createAnimation();
    this.createControls();
    this.createBackgound();
    this.createGround();
    this.createLevel();
    this.createPlayer();
    this.createObstacles();
    this.createCollaider();
    this.createCamera();

    this.jumpSound = this.sound.add('jump');
  }

  createAnimation() {
    this.anims.createFromAseprite('ram-spritesheet');
    this.anims.get('Ram Dash').repeat = -1;
    this.anims.get('Ram Idle').repeat = -1;
    this.anims.get('Ram Dizzy').repeat = -1;
    this.anims.get('Ram Hurt').repeat = -1;
    this.anims.get('Ram Takeoff Run').repeat = -1;
    this.anims.get('Ram Jump').repeat = -1;
    this.anims.get('Ram Run').repeat = -1;
  }

  createControls() {
    this.controller = new PlayerController(this);
    this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PAUSE, true, false);
    this.pauseKey.on('down', this.onPauseKeyDown, this);

    this.numKeys = {
      key1: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE, true, false).on('down', this.onNumKeyDown, this),
      key2: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO, true, false).on('down', this.onNumKeyDown, this),
      key3: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE, true, false).on('down', this.onNumKeyDown, this),
      key4: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR, true, false).on('down', this.onNumKeyDown, this),
      key5: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE, true, false).on('down', this.onNumKeyDown, this),
      key6: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX, true, false).on('down', this.onNumKeyDown, this),
      key7: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN, true, false).on('down', this.onNumKeyDown, this),
      key8: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT, true, false).on('down', this.onNumKeyDown, this),
      key9: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE, true, false).on('down', this.onNumKeyDown, this)
    };

    // use Phaser.Input.Keyboard. KeyboardPlugin
    // doc: https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.KeyboardPlugin.html
    // An object containing the properties: up, down, left, right, space and shift.
    this.cursor = this.input.keyboard.createCursorKeys();
  }

  createBackgound() {
    // this.backgroundLayer1 = new BackgroundLayer(this);
    // this.backgroundLayer2 = new BackgroundLayer(this);
    // this.backgroundLayer3 = new BackgroundLayer(this);
    // for (let i = 0; i < 5; i++) {
    //   this.backgroundLayer1.add(this.add.image(0, 0, 'background-layer-1').setOrigin(0.5, 1)).setScrollFactor(0.5, 1);
    //   this.backgroundLayer2.add(this.add.image(0, 0, 'background-layer-2').setOrigin(0.5, 1)).setScrollFactor(0.8, 1);
    //   this.backgroundLayer3.add(this.add.image(0, 0, 'background-layer-3').setOrigin(0.5, 1));
    // }
    // this.backgroundLayer1.update(5000);
    // this.backgroundLayer2.update(5000);
    // this.backgroundLayer3.update(5000);
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

  createLevel() {
    this.level = new Level1(this);
  }

  createPlayer() {
    const playerStartX = this.level.mapChunkSize / 2;
    const playerStartY = this.level.mapGroundPosition - PLAYER_SIZE / 2;
    this.player = new Player(this, playerStartX, playerStartY, 'ram-spritesheet', 3, this.controller)
    this.player.setBounceX(0);
    this.player.setDepth(2000);
  }

  createObstacles() {
    this.obstacles = this.physics.add.group();
  }

  createCollaider() {
    // Do not collide with obstacles
    // this.physics.add.collider(this.player, this.obstacles, null, this.onFacedObstacle, this);
    // this.physics.add.collider(this.ground, this.player);
    // this.physics.add.collider(this.ground, this.obstacles);

    this.level.mapChunks.forEach(layer => {
      this.physics.add.collider(this.player, layer);
      layer.setCollisionByProperty({ collides: true });
    });
  }

  createCamera() {
    //this.cameras.main.setBackgroundColor('rgba(217, 240, 245, 1)');
    this.cameras.main.zoom = 1;
    this.cameras.main.startFollow(
      this.player,
      true,
      1, 1,
      this.cameras.main.width * PLAYER_CAMERA_POSITION_X,
      this.cameras.main.height * PLAYER_CAMERA_POSITION_Y
    );
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

    // Do not update background
    // this.updateBackground();

    if (this.cursor.right.isDown) {
      this.player.run('forward');
    }
    if (this.cursor.left.isDown) {
      this.player.run('backward');
    }
    if (this.cursor.down.isDown) {
      this.player.takeoffRun();
    }

    const s = this.scene.get('Boot')
    s.text.setText(`Player (${this.player.x}, ${this.player.y}), tick ${Math.round(time)}`);

  }

  updateGround() {

    // FOR generate ground

    // this.ground.getMatching('active', true).forEach(item => {
    //   if (item.x < this.deadline) {
    //     this.ground.kill(item);
    //   }
    // });
    // while (this.nextGround < this.deadline + GROUND_SPAWN_DISTANCE) {
    //   this.ground.get(this.nextGround, 0).setActive(true);
    //   this.nextGround += 200;
    // }
    // this.ground.setOrigin(0.5, 1).refresh();


  }

  dice() {
    return Math.floor(Math.random() * 10);
  }

  spawnBigObstacle() {
    const yPosition = -16-75-1; // half of height and screen position
    const distance = [350, 350, 350, 400, 400, 400, 500, 500, 600, 700][this.dice()];
    const frame = [19, 19, 19, 19, 19, 18, 18, 18, 18, 29][this.dice()];
    this.spawnedObject += distance;
    let obstacle = this.obstacles.getFirstDead(false);
    if (!obstacle) {
      obstacle = (new Obstacle(this, this.spawnedObject, yPosition, 'spritesheet-64', frame))
        .setSize(50, 32)
        .setDepth(1000);
      this.obstacles.add(obstacle);
    }
    obstacle.spawn(this.spawnedObject, yPosition);
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
    // while (this.spawnedObject < this.deadline + SPAWN_DISTANCE) {
    //   this.spawnBigObstacle();
    // }
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
      if (!this.player.isDead) {
        this.player.idle();
      }
    } else {
      this.paused = false;
      if (!this.player.isDead) {
        this.player.run();
      }
    }
  }

  onNumKeyDown(key) {
    switch (key.keyCode) {
      case Phaser.Input.Keyboard.KeyCodes.ONE:
        this.player.dash();
        break;
      case Phaser.Input.Keyboard.KeyCodes.TWO:
        this.player.idle();
        break;
      case Phaser.Input.Keyboard.KeyCodes.THREE:
        this.player.dizzy();
        break;
      case Phaser.Input.Keyboard.KeyCodes.FOUR:
        this.player.faint();
        break;
      case Phaser.Input.Keyboard.KeyCodes.FIVE:
        this.player.hurt();
        break;
      case Phaser.Input.Keyboard.KeyCodes.SIX:
        this.player.attack();
        break;
      case Phaser.Input.Keyboard.KeyCodes.SEVEN:
        this.player.takeoffRun();
        break;
      case Phaser.Input.Keyboard.KeyCodes.EIGHT:
        this.player.jump();
        break;
      case Phaser.Input.Keyboard.KeyCodes.NINE:
        this.player.run();
        break;
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
