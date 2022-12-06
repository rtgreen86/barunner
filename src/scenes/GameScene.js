import Phaser from 'Phaser';

import Obstacle from '../entities/Obstacle';
import Player from '../entities/Player';

import { checkType } from '../utils';

const CAMERA_STABILIZE_ERROR = 40;
const CAMERA_STABLE_LERP = 1;
const CAMERA_MOVE_LERP = 0.4;

const PLAYER_SIZE = 128;
const PLAYER_CAMERA_POSITION_X = -0.25;
const PLAYER_CAMERA_POSITION_Y = 0.25;

// const SPAWN_DISTANCE = 10000;
// const GROUND_SPAWN_DISTANCE = SPAWN_DISTANCE * 1.5;

const DEADLINE_OFFSET = -100;

// const PLAYER_RESPAWN_TIMEOUT = 1000;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init() {
    this.deadline = DEADLINE_OFFSET;
    this.spawnedObject = 500;
    this.paused = false;
    this.timeOfDeath = null;
    this.startFallingVelocity = 10;
  }

  create() {
    this.createBackgound();
    this.createMap();
    this.createPlayer();
    this.createControls();
    this.createObstacles();
    this.createCollaider();
    this.createCamera();

    this.jumpSound = this.sound.add('jump');

    this.scene.run('DebugScene');
  }



  getObstacle(x, y) {
    return this.obstacles2
      .shuffle()
      .get(x, y)
      .setActive(true)
      .setSize(64, 64)
      .setOrigin(0.5, 0.5)
      // .setOrigin(0.5, 0.75);
  }

  createObstacles() {
    this.obstacles = this.physics.add.group();

    // this.obstacles2 = this.physics.add.group({
    //   gravityX: 0,
    //   gravityY: 0,
    //   maxVelocityX: 0,
    //   maxVelocityY: 0,
    //   velocityX: 0,
    //   velocityY: 0,
    //   immovable: true
    // });

    // const obs = this.level.objects[0].objects[0];
    // this.getObstacle(obs.x, obs.y);


    // const areas = this.map.filterObjects('room1/objects', obj => obj.name === 'obstacle');
    // areas.forEach(area => {
    //   this.getObstacle(area.x, area.y + area.height);
    // });

    // this.obstacles2 = this.physics.add.group({
    //   // classType: function,
    //   key: 'objects-spritesheet',
    //   frame: [2, 3],
    //   // quantity: number,
    //   visible: true,
    //   active: false,
    //   // repeat: number,
    //   // randomKey: true,
    //   randomFrame: true,
    //   // frameQuantity: number,
    //   // max: number,
    //   setOrigin: {
    //     x: 0.5,
    //     y: 0.75
    //   }
    // });

    this.obstacles2 = this.physics.add.group({
      gravityX: 0,
      gravityY: 0,
      maxVelocityX: 0,
      maxVelocityY: 0,
      velocityX: 0,
      velocityY: 0,
      immovable: true,
      defaultKey: 'objects-spritesheet',
      defaultFrame: 2,
    });

    this.obstacles2.createMultiple(
      {
          key: 'objects-spritesheet',
          frame: [2, 3],
          quantity: 4,
          visible: true,
          active: false,
          // repeat: number,
          // randomKey: true,
          randomFrame: true,
          // frameQuantity: number,
          // max: number,
          setOrigin: {
            x: 0.5,
            y: 0.75
          }
        }
    )

    this.obstacles2.shuffle();

    // Start Obstacle
    // this.getObstacle(8 * 128 + 500, 11 * 128)
  }

  createCollaider() {
    // Do not collide with obstacles
    // this.physics.add.collider(this.player, this.obstacles, null, this.onFacedObstacle, this);
    // this.physics.add.collider(this.ground, this.player);
    // this.physics.add.collider(this.ground, this.obstacles);

    // collide with level

    this.map.layers.forEach(layer => {
      this.physics.add.collider(this.player, layer.tilemapLayer, this.onPlayerCollideGround, null, this);
      this.physics.add.collider(this.obstacles2, layer.tilemapLayer);
      this.map.setCollisionByProperty({ collides: true }, true, true, layer.name);
    });

    const cb = () => {
      this.player.setVelocityY(-1000);
      this.player.hurt();
    };

    this.physics.add.collider(this.player, this.obstacles2, cb, null, this);
  }

  createCamera() {
    this.cameras.main.setBackgroundColor('rgba(217, 240, 245, 1)');
    this.cameras.main.zoom = 1;
    this.cameras.main.startFollow(
      this.player,
      true,
      1, 0,
      this.cameras.main.width * PLAYER_CAMERA_POSITION_X,
      this.cameras.main.height * PLAYER_CAMERA_POSITION_Y
    );
  }

  update(time, delta) {
    this.updateBackground();
    this.updateGround();
    this.updatePlayer(time, delta);



    this.updateDeadline();
    this.respawnObjects();

    // if (this.player.isDead && !this.timeOfDeath) {
    //   this.timeOfDeath = time;
    //   this.playerAlive = false;
    // }

    // Respawn
    // if (
    //   !this.playerAlive &&
    //   this.controller.isJumpDown &&
    //   time - this.timeOfDeath >= PLAYER_RESPAWN_TIMEOUT
    // ) {
    //   this.respawnScene();
    // }

    // Do not update background
    // this.updateBackground();

    // on the ground

    // if (this.cursor.right.isDown && this.canPlayerRun()) {
    //   this.player.run('forward');
    //   this.player.isRunning = true;
    // }
    // if (this.cursor.left.isDown && this.canPlayerRun()) {
    //   this.player.run('backward');
    //   this.player.isRunning = true;
    // }
    // if (this.cursor.down.isDown && this.canRun()) {
    //   this.player.takeoffRun();
    //   this.player.isRunning = true;
    // }
    // if (this.player.isOnGround && !this.player.isRunning) {
    //   this.player.idle();
    // }

    // this.player.update(time, delta);

    // const playerOnGround = this.isisOnGround(this.player);

    // if (!playerOnGround) {
    //   this.player.fall();
    // }
    // if (playerOnGround && this.player.isFalling) {
    //   this.player.landing();
    // }

    // if (playerOnGround) {
    //   this.player.idle();
    // }

    // if (this.cursor.space.isDown && this.player.isJumping) {
    //   this.player.continueJump(delta);
    // }
    // if (!this.player.isOnGround && !this.cursor.space.isDown) {
    //   this.player.fly();
    // }
    // if (this.isFalling(this.player)) {
    //   this.player.fall();
    // }

    this.stabilizeTheCamera();
    // this.removeDistantObstacles();
  }

  createBackgound() {
    const width = this.game.config.width;
    const height = 350;
    const x = 0;
    const y = this.game.config.height - 63;

    this.backgroundLayers = [
      this.add.tileSprite(x, y, width, height, 'background-layer-1')
        .setScrollFactor(0)
        .setOrigin(0, 1)
        .setData('textureScrollFactor', 0.1),

      this.add.tileSprite(x, y, width, height, 'background-layer-2')
        .setScrollFactor(0)
        .setOrigin(0, 1)
        .setData('textureScrollFactor', 0.2),

      this.add.tileSprite(x, y, width, height, 'background-layer-3')
        .setScrollFactor(0)
        .setOrigin(0, 1)
        .setData('textureScrollFactor', 0.3)
    ];
  }

  updateBackground() {
    for (const backgroundLayer of this.backgroundLayers) {
      backgroundLayer.tilePositionX = this.cameras.main.scrollX * backgroundLayer.data.values.textureScrollFactor;
    }
  }

  createMap() {
    this.map = this.add.tilemap('map-level-1');
    this.map.tilesets.forEach(tileset => this.map.addTilesetImage(tileset.name, tileset.name));
    this.createGroundLayer('ground', 0, 0);
  }

  createGroundLayer(layerName, x = 0, y = 0) {
    const layer = this.createDoubleLayer(layerName, x, y);
    layer.setScrollFactor(0, 1);
  }

  createDoubleLayer(layerName, x = 0, y = 0) {
    const sourceLayer = this.map.getLayer(layerName);
    const width = sourceLayer.width;
    const height = sourceLayer.height;
    const destLayer = this.map.createBlankLayer(
      `double-${layerName}`, this.map.tilesets,
      x, y, width * 2, height,
      sourceLayer.baseTileWidth, sourceLayer.baseTileHeight
    );
    this.copyTilesFrom(layerName, 0, 0, width, height, 0, 0);
    this.copyTilesFrom(layerName, 0, 0, width, height, width, 0);
    return destLayer;
  }

  copyTilesFrom(sourceLayer, x = 0, y = 0, width = 1, height = 1, destX = 0, destY = 0) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const sourceTile = this.map.getTileAt(x + i, y + j, true, sourceLayer);
        this.map.getTileAt(destX + i, destY + j, true).copy(sourceTile);
      }
    }
  }

  createPlayer() {
    const playerX = this.map.properties.find(prop => prop.name === 'playerX');
    const x = playerX.value * this.map.tileWidth;
    const playerY = this.map.properties.find(prop => prop.name === 'playerY');
    const y = playerY.value * this.map.tileHeight - PLAYER_SIZE / 3;
    this.player = new Player(this, x, y, 'ram-spritesheet', 3, this.controller)
    this.player.setDepth(2000);
  }

  updatePlayer(time, delta) {
    if (this.player.isJumping && (this.cursor.space.isDown || this.input.pointer1.isDown)) {
      this.player.jumpContinue(delta);
    }
    if (this.player.isJumping && !(this.cursor.space.isDown || this.input.pointer1.isDown)) {
      this.player.fly();
    }
    if (this.isFalling(this.player)) {
      this.player.fall();
    }
    if (this.cursor.right.isDown) {
      this.player.direction = 'right';
      this.setCameraToRight();
    }
    if (this.cursor.left.isDown) {
      this.player.direction = 'left';
      this.setCameraToLeft();
    }
    if (this.numKeys.key1.isDown) {
      this.player.idle();
    }
  }

  isFalling(object) {
    return object.body.velocity.y > this.startFallingVelocity;
  }



  createControls() {
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

    this.cursor.space.on('down', this.onSpaceDown, this);
    this.cursor.left.on('down', this.onArrowLeftDown, this);
    this.cursor.right.on('down', this.onArrowRightDown, this);
  }

  clearChunk(chunkName) {
    const levelLayer = this.getChunkLevel(chunkName)
    const fromX = levelLayer.tilemapLayer.x;
    const toX = fromX + levelLayer.tilemapLayer.width;
    this.getActiveObstaclesInRange(fromX, toX).forEach(obstacle => this.obstacles2.kill(obstacle));
  }

  updateGround() {
    const width = this.map.layer.tilemapLayer.width / 2;
    const cameraX = this.cameras.main.scrollX;
    const offset = cameraX - Math.floor(cameraX / width) * width;
    this.map.layer.tilemapLayer.x = -offset;
  }

  dice() {
    return Math.floor(Math.random() * 10);
  }

  spawnBigObstacle() {
    const yPosition = -16 - 75 - 1; // half of height and screen position
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

  get playerChunk() {
    return Math.floor(this.player.x / this.map.widthInPixels);
  }

  getLevelProperty = name => this.map.properties.find(prop => prop.name === name);

  getLevelPropertyTyped = (name, type = 'string') => checkType(this.getLevelProperty(name), name, type);

  getChunkLevel = chunkName => this.map.getLayer(`${chunkName}/level`);

  getActiveObstaclesInRange = (fromX, toX) => this.obstacles2.getMatching('active', true).filter(obst => obst.x >= fromX && obst.x <= toX);

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
      case Phaser.Input.Keyboard.KeyCodes.TWO:
        this.player.dash();
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
        this.player.fall();
        break;
      case Phaser.Input.Keyboard.KeyCodes.NINE:
        this.player.landing();
        break;
    }
  }

  onFacedObstacle(player, obstacle) {
    const { x: px, y: py } = player.getBottomRight();
    const { x: ox, y: oy } = obstacle.getTopLeft();
    const side = py - oy >= px - ox;
    if (side) {
      player.die();
    }
    return true;
  }

  onPlayerCollideGround() {
    if (this.player.isFalling) {
      this.player.landing();
    }
    if (this.cursor.space.isDown || this.input.pointer1.isDown) {
      this.player.jumpStart();
    }
    if (this.cursor.right.isDown || this.cursor.left.isDown) {
      this.player.run();
    }
  }

  onSpaceDown() {
    // if (this.cursor.space.isDown && this.canJump(this.player)) {
    //   this.player.jumpStart();
    // }
  }

  onArrowRightDown() {
    // this.player.direction = 'right';
    // this.setCameraToRight();
    // if (this.canRun(this.player)) {
    //   this.player.run();
    // }
  }

  onArrowLeftDown() {
    // this.player.direction = 'left';
    // this.setCameraToLeft();
    // if (this.canRun(this.player)) {
    //   this.player.run();
    // }
  }



  setCameraToRight() {
    this.setCameraOffset(
      this.cameras.main.width * PLAYER_CAMERA_POSITION_X,
      this.cameras.main.height * PLAYER_CAMERA_POSITION_Y
    )
  }

  setCameraToLeft() {
    this.setCameraOffset(
      -this.cameras.main.width * PLAYER_CAMERA_POSITION_X,
      this.cameras.main.height * PLAYER_CAMERA_POSITION_Y
    )
  }

  setCameraOffset(offsetX, offsetY) {
    this.cameras.main.setLerp(CAMERA_MOVE_LERP, 0);
    this.cameras.main.setFollowOffset(offsetX, offsetY);
  }

  stabilizeTheCamera() {
    const error = CAMERA_STABILIZE_ERROR;
    const focusX = this.cameras.main.scrollX + (this.cameras.main.width / 2 + this.cameras.main.followOffset.x);
    if (Math.abs(this.player.x - focusX) < error) {
      this.cameras.main.setLerp(CAMERA_STABLE_LERP, 0);
    }
  }



  removeDistantObstacles() {
    const distance = 5000;
    const distantObstacles = this.obstacles2.getMatching('active', true).filter(obst => obst.x < this.player.x - distance || obst.x > this.player.x + distance || obst.y < this.player.y - distance || obst.y > this.player.y + distance);
    distantObstacles.forEach(obst => this.obstacles2.kill(obst));
  }
}
