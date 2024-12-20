import Phaser from 'phaser';

import BackgroundTileSprite from '../entities/BackgroundTileSprite';
import BackgroundLayer from '../entities/BackgroundLayer';
import Player from '../entities/Player';
import Controller from '../entities/Controller';

import { OpenMainMenu } from '../commands';

const CAMERA_ZOOM = 1;

const CAMERA_STABILIZE_ERROR = 40;
const CAMERA_STABLE_LERP = 1;
const CAMERA_MOVE_LERP = 0.4;

const PLAYER_CAMERA_POSITION_X = -0.25;
const PLAYER_CAMERA_POSITION_Y = 0.25;

const SPAWN_DISTANCE = 4000;

const START_FALLING_VELOCITY = 10;

export const getPropertyByName = (props, propertyName, defaultValue) => props.find(prop => prop.name === propertyName) || defaultValue;

export const getPropertyValueByName = (props, propertyName, defaultValue) => getPropertyByName(props, propertyName, { value: defaultValue}).value;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.map = this.createMap();
    this.createBackgroundTileSprite(this.map.images);
    this.createBackgrounLayers(this.map.layers);
    this.createGroundLayer('ground', 0, 0);
    this.player = this.add.existing(this.createPlayer()).setName('The Player');
    this.playerStartPosition = this.player.x;
    this.createControls();
    this.createObstacles();
    this.createCollaider();
    this.createCamera();
    this.jumpSound = this.sound.add('jump');

    this.generatedRight = this.cameras.main.scrollX;
    this.generatedLeft = this.cameras.main.scrollX;

    this.prevDistance = this.player.x;

    this.data.set('distance', 0);
    this.data.set('beats', 0);

    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC, true, false);

    this.scene.run('ScoreboardScene');
    this.scene.run('virtual-gamepad-scene');

    this.subscribe();
  }

  subscribe() {
    this.events.on('destroy', this.#handleDestroy, this);
    this.events.on('pause', this.#handlePause, this);
    this.events.on('resume', this.#handleResume, this);

    this.escKey.on('down', this.#handleEscDown, this);
  }

  unsubscribe() {
    this.events.off('destroy', this.#handleDestroy, this);
    this.events.off('pause', this.#handlePause, this);
    this.events.off('resume', this.#handleResume, this);

    this.escKey.off('down', this.#handleEscDown, this);
  }

  update(time, delta) {
    this.updateGround();
    this.updatePlayer(time, delta);
    this.updateObjects();
    this.stabilizeTheCamera();

    const distanceDiff = Math.max(this.player.x - this.prevDistance, 0);
    this.prevDistance = this.player.x;
    this.data.inc('distance', distanceDiff / 70);
  }

  createMap() {
    const map = this.add.tilemap('map-level-1');
    map.tilesets.forEach(tileset => map.addTilesetImage(tileset.name, tileset.name));
    return map;
  }

  createBackgroundTileSprite(images) {
    const width = this.game.config.width;
    const height = this.game.config.height;

    return this.add.group(

      images
        .filter(image => getPropertyValueByName(image.properties, 'class') === 'BackgroundTileSprite')
        .map(image => new BackgroundTileSprite(this, image, width, height))
        .map(layer => this.add.existing(layer)),

      {runChildUpdate: true}

    );
  }

  createBackgrounLayers(layersData) {
    const width = this.game.config.width;

    return this.add.group(

      layersData
        .filter(layerData => getPropertyValueByName(layerData.properties, 'class') === 'BackgroundLayer')
        .map(layerData => BackgroundLayer.create(this, this.map, layerData.name, 0, 515))
        .map(layer => this.add.existing(layer)),

      {runChildUpdate: true}

    );
  }

  createGroundLayer(layerName, x = 0, y = 0) {
    const layer = this.map.createLayer(layerName, this.map.tilesets, x, y);
    layer.setOrigin(0.5, 0.5);
    layer.setScrollFactor(0, 1);
    return layer;
  }

  createObstacles() {
    this.obstacles = this.physics.add.group({
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

    this.obstacles.createMultiple({
      key: 'objects-spritesheet',
      frame: [2, 3],
      quantity: 4,
      visible: false,
      active: false,
      randomFrame: true,
      setOrigin: {
        x: 0.5,
        y: 0.75
      }
    });
  }

  createCollaider() {
    this.map.layers.forEach(layer => {
      this.physics.add.collider(this.player, layer.tilemapLayer, this.handlePlayerCollideGround, null, this);
      this.physics.add.collider(this.obstacles, layer.tilemapLayer);
      this.map.setCollisionByProperty({ collides: true }, true, true, layer.name);
    });

    this.physics.add.collider(this.player, this.obstacles, this.handlePlayerCollideObstacle, null, this);
  }

  createCamera() {
    this.cameras.main.setBackgroundColor('rgba(217, 240, 245, 1)');
    this.cameras.main.zoom = CAMERA_ZOOM;
    this.cameras.main.startFollow(
      this.player,
      true,
      1, 0,
      this.cameras.main.width * PLAYER_CAMERA_POSITION_X,
      this.cameras.main.height * PLAYER_CAMERA_POSITION_Y
    );
  }

  createPlayer() {
    const playerX = this.map.properties.find(prop => prop.name === 'playerX');
    const x = playerX.value * this.map.tileWidth;
    const playerY = this.map.properties.find(prop => prop.name === 'playerY');
    const y = playerY.value * this.map.tileHeight - Player.height / 2;
    const player = new Player(this, x, y, 'ram-spritesheet', 3)
    player.setDepth(2000);
    return player;
  }

  createControls() {
    this.controller = new Controller(this);

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
  }


  updateObjects() {
    const distances = [1000, 1500, 1500, 2000, 2000];
    const dist = Phaser.Math.RND.pick(distances);
    const max = Math.max(...distances);

    const zero = this.player.x;

    if (this.player.direction === 'right' && this.generatedRight + max < zero + SPAWN_DISTANCE) {
      const x = this.generatedRight + dist;
      const y = (this.map.heightInPixels / 2) - 64 / 2;
      this.obstacles.shuffle();
      const obstacle = this.obstacles.getFirstDead(true, x, y)
        .setSize(64, 64)
        .setOrigin(0.5, 0.5)
        .setActive(true)
        .setVisible(true);
      this.physics.world.enable(obstacle);

    }

    if (this.player.direction === 'left' && this.generatedLeft - max > zero - SPAWN_DISTANCE) {
      const x = this.generatedLeft - dist;
      const y = (this.map.heightInPixels / 2) - 64 / 2;
      this.obstacles.shuffle();
      const obstacle = this.obstacles.getFirstDead(true, x, y)
        .setSize(64, 64)
        .setOrigin(0.5, 0.5)
        .setActive(true)
        .setVisible(true);
      this.physics.world.enable(obstacle);
    }

    this.obstacles.getMatching('active', true).forEach(obstacle => {
      if (obstacle.x < zero - SPAWN_DISTANCE || obstacle.x > zero + SPAWN_DISTANCE) {
        this.obstacles.killAndHide(obstacle);
        this.physics.world.disable(obstacle)
      }
    });

    this.generatedLeft = this.obstacles.getMatching('active', true).reduce((min, obstacle) => Math.min(min, obstacle.x), zero);
    this.generatedRight = this.obstacles.getMatching('active', true).reduce((max, obstacle) => Math.max(max, obstacle.x), zero);
  }

  updateGround() {
    const width = this.map.layer.tilemapLayer.width - this.game.config.width;
    const cameraX = this.cameras.main.scrollX;
    const offset = cameraX - Math.floor(cameraX / width) * width;
    this.map.layer.tilemapLayer.x = -offset;
  }

  updatePlayer(time) {
    if (this.player.isJumping && this.controller.isActionDown) {
      this.player.jump(this.controller.getActionDuration());
    }
    if (this.player.isJumping && !this.controller.isActionDown) {
      this.player.fly();
    }
    if (this.isFalling(this.player)) {
      this.player.fall();
    }
    if (this.controller.cursor.right.isDown) {
      this.player.direction = 'right';
      this.setCameraToRight();
    }
    if (this.controller.cursor.left.isDown) {
      this.player.direction = 'left';
      this.setCameraToLeft();
    }
    if (this.numKeys.key1.isDown) {
      this.player.idle();
    }
    this.player.update(time);
  }

  isFalling(object) {
    return object.body.velocity.y > START_FALLING_VELOCITY;
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

  handlePlayerCollideGround() {
    if (this.player.isFalling) {
      this.player.landing();
    }
    if (this.player.isRunning && this.controller.isActionDown) {
      this.player.jump(this.controller.getActionDuration());
    }
    if (this.controller.isActionDown) {
      this.player.run();
      this.player.jump(this.controller.getActionDuration());
    }
    if (this.controller.cursor.right.isDown || this.controller.cursor.left.isDown) {
      this.player.run();
    }
  }

  handlePlayerCollideObstacle(player, obstacle) {
    const { x: px, y: py } = player.getBottomRight();
    const { x: ox, y: oy } = obstacle.getTopLeft();
    const sideCollide = py - oy >= px - ox;
    if (sideCollide) {
      this.player.setVelocityY(-1000);
      this.player.hurt();
      this.data.inc('beats', 1);
    }

    return true;
  }

  #handleEscDown() {
    new OpenMainMenu(this.scene).execute();
  }

  #handleDestroy() {
    console.log('GameScene: destroy');
    this.unsubscribe();
  }

  #handlePause() {
    console.log('GameScene: sleep');
    this.scene.sleep('ScoreboardScene');
  }

  #handleResume() {
    console.log('GameScene: wakeup');
    this.scene.wake('ScoreboardScene');
  }
}
