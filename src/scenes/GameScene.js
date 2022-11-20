import Phaser from 'Phaser';

import Obstacle from '../entities/Obstacle';
import Player from '../entities/Player';
import PlayerController from '../entities/PlayerController';
// import BackgroundLayer from '../entities/BackgroundLayer';

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

  getLevelProperty = (name) => this.level.properties.find(prop => prop.name === name);

  getLevelPropertyTyped = (name, type = 'string') => checkType(this.getLevelProperty(name), name, type);

  init() {
    this.deadline = DEADLINE_OFFSET;
    this.spawnedObject = 500;
    this.paused = false;
    this.playerAlive = true;
    this.timeOfDeath = null;
    this.nextGround = 200;
    this.startFallingVelocity = 10;

    this.levelName = 'map-level-1';
    this.levelTileset = 'level-1-tileset';
    this.levelObjects = 'objects';
  }

  create() {
    this.createControls();
    this.createBackgound();
    this.createGround();
    this.createLevel();
    this.createPlayer();
    this.createObstacles();
    this.createCollaider();
    this.createCamera();

    this.jumpSound = this.sound.add('jump');

    this.scene.run('DebugScene');
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

    const createObstacle = () => {
      this.getObstacle(this.player.x + 500, 1380)
    }

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O, true, false).on('down', createObstacle)

    // use Phaser.Input.Keyboard. KeyboardPlugin
    // doc: https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.KeyboardPlugin.html
    // An object containing the properties: up, down, left, right, space and shift.
    this.cursor = this.input.keyboard.createCursorKeys();

    this.cursor.space.on('down', this.onSpaceDown, this);
    this.cursor.left.on('down', this.onArrowLeftDown, this);
    this.cursor.right.on('down', this.onArrowRightDown, this);
  }

  getObstacle(x, y) {
    return this.obstacles2.get(x, y, 'objects', 2)
        .setActive(true)
        .setSize(64, 64)
        .setOrigin(0, 1);
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
    this.level = this.add.tilemap(this.levelName);
    this.level.tilesets.forEach(tileset => this.level.addTilesetImage(tileset.name, tileset.name));
    this.createChunks();
    console.log(this.level);
  }

  createChunks() {
    const prop = this.getLevelPropertyTyped('chunks', 'string');
    this.chunks = prop.value.split(',').map(item => item.trim());
    this.chunks.sort(() => Math.random() - .5).forEach((name, index) => {
      this.createChunk(name, index);
    });
  }

  createChunk(name, position) {
    const layerName = `${name}/level`;
    const x = position * this.level.width * this.level.tileWidth
    const y = 0;
    this.level.createLayer(layerName, this.level.tilesets, x, y);
  }

  createPlayer() {
    const [x, y] = this.getPlayerStartPosition();
    this.player = new Player(this, x, y, 'ram-spritesheet', 3, this.controller)
    this.player.setBounceX(0.7);
    this.player.setDepth(2000);
  }

  getPlayerStartPosition() {
    const playerX = this.level.properties.find(prop => prop.name === 'playerX');
    const playerY = this.level.properties.find(prop => prop.name === 'playerY');
    return [playerX.value * this.level.tileWidth, playerY.value * this.level.tileHeight - PLAYER_SIZE / 3];
  }

  createObstacles() {
    this.obstacles = this.physics.add.group();
    this.obstacles2 = this.physics.add.group({
      gravityX: 0,
      gravityY:	0,
      maxVelocityX: 0,
      maxVelocityY: 0,
      velocityX: 0,
      velocityY: 0,
      immovable: true
    });

    const obs = this.level.objects[0].objects[0];
    this.getObstacle(obs.x, obs.y);


    const areas = this.level.filterObjects('room1/objects', obj => obj.name === 'obstacle');
    areas.forEach(area => {
      this.getObstacle(area.x, area.y + area.height);
    });
  }

  createCollaider() {
    // Do not collide with obstacles
    // this.physics.add.collider(this.player, this.obstacles, null, this.onFacedObstacle, this);
    // this.physics.add.collider(this.ground, this.player);
    // this.physics.add.collider(this.ground, this.obstacles);

    // collide with level


    this.level.layers.forEach(layer => {
      this.physics.add.collider(this.player, layer.tilemapLayer, this.onPlayerCollideGround, null, this);
      this.physics.add.collider(this.obstacles2, layer.tilemapLayer);
      this.level.setCollisionByProperty({ collides: true }, true, true, layer.name);
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
    this.updateDeadline();
    this.respawnObjects();

    if (this.player.isDead && !this.timeOfDeath) {
      this.timeOfDeath = time;
      this.playerAlive = false;
    }

    // Respawn
    // if (
    //   !this.playerAlive &&
    //   this.controller.isJumpDown &&
    //   time - this.timeOfDeath >= PLAYER_RESPAWN_TIMEOUT
    // ) {
    //   this.respawnScene();
    // }

    this.updateGround();

    // Do not update background
    // this.updateBackground();


    let minLayer = this.level.layer;
    let minLayerPosition = this.getLayerPosition(minLayer.name);
    let maxLayer = this.level.layer;
    let maxLayerPosition = this.getLayerPosition(maxLayer.name);

    for (const layer of this.level.layers) {
      const layerPosition = this.getLayerPosition(layer.name);
      if (layerPosition > maxLayerPosition) {
        maxLayerPosition = layerPosition;
        maxLayer = layer;
      }
      if (layerPosition < minLayerPosition) {
        minLayerPosition = layerPosition;
        minLayer = layer;
      }
    }



    if (this.playerChunk === minLayerPosition) {
      maxLayer.tilemapLayer.setPosition((this.playerChunk - 1) * this.level.widthInPixels, maxLayer.y);
      console.log(this.playerChunk, minLayerPosition)
    }
    if (this.playerChunk === maxLayerPosition) {
      minLayer.tilemapLayer.setPosition((this.playerChunk + 1) * this.level.widthInPixels, minLayer.y);
    }

    // jump


    if (this.cursor.space.isDown && this.canPlayerContinueJump(time)) {
      this.player.jump();
      this.player.isOnGround = false;
    }

    // on the ground

    // if (this.cursor.right.isDown && this.canPlayerRun()) {
    //   this.player.run('forward');
    //   this.player.isRunning = true;
    // }
    // if (this.cursor.left.isDown && this.canPlayerRun()) {
    //   this.player.run('backward');
    //   this.player.isRunning = true;
    // }
    if (this.cursor.down.isDown && this.canRun()) {
      this.player.takeoffRun();
      this.player.isRunning = true;
    }
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

    if (this.cursor.space.isDown && this.player.isJumping) {
      this.player.continueJump(delta);
    }
    if (!this.player.isOnGround && !this.cursor.space.isDown) {
      this.player.fly();
    }
    if (this.isFalling(this.player)) {
      this.player.fall();
    }

    this.stabilizeTheCamera();
    this.removeDistantObstacles();
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

  isFalling(object) {
    return object.body.velocity.y > this.startFallingVelocity;
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

  get playerChunk() {
    return Math.floor(this.player.x / this.level.widthInPixels);
  }

  getLayerPosition(layer) {
    return Math.floor(this.level.getLayer(layer).tilemapLayer.x / this.level.widthInPixels);
  }

  canJump(object) {
    return object.isOnGround;
  }

  canPlayerContinueJump(time) {
    return time < this.player.jumpStartTime + this.player.jumpMaxTime;
  }

  canRun(object) {
    return object.isOnGround;
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
        this.player.fall();
        break;
      case Phaser.Input.Keyboard.KeyCodes.NINE:
        this.player.landing();
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

  // onPlayerLanded() {
  //   if (this.jump) {
  //     this.player.idle();
  //     this.jump = false;
  //   }
  // }

  onPlayerCollideGround() {
    this.player.landing();
  }

  onSpaceDown() {
    if (this.cursor.space.isDown && this.canJump(this.player)) {
      this.player.jump();
    }
  }

  onArrowRightDown() {
    this.player.direction = Player.DIRECTION_RIGHT;
    this.setCameraToRight();
    if (this.canRun(this.player)) {
      this.player.run();
    }
  }

  onArrowLeftDown() {
    this.player.direction = Player.DIRECTION_LEFT;
    this.setCameraToLeft();
    if (this.canRun(this.player)) {
      this.player.run();
    }
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
    const distance = 1000;
    const distantObstacles = this.obstacles2.getMatching('active', true).filter(obst => obst.x < this.player.x - distance || obst.x > this.player.x + distance || obst.y < this.player.y - distance || obst.y > this.player.y + distance);
    distantObstacles.forEach(obst => this.obstacles2.kill(obst));
  }


}


function checkType(prop, name, type) {
  if (typeof prop !== 'object') {
    throw new TypeError(`Property '${name}' is ${typeof prop}`);
  }
  if (prop.type !== type) {
    throw new TypeError(`Property ${name} should be a ${type}.`)
  }
  return prop;
}
