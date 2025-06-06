import Phaser, { Scene } from 'phaser';
import BackgroundTileSprite from '../entities/BackgroundTileSprite';
import BackgroundLayer from '../entities/BackgroundLayer';
import { Controller } from './ControllerScene';
import { OpenMainMenu } from '../commands';
import * as CONST from '../const';
import { TextureKey } from '../resources';
import { Direction, CharAttributes, SceneKey, PlayerState } from '../enums';

import Player from '../entities/Player';
import Obstacle from '../entities/Obstacle';

const CAMERA_STABILIZE_ERROR = 40;
const CAMERA_STABLE_LERP = 1;

const SPAWN_DISTANCE = 4000;

const START_FALLING_VELOCITY = 10;

type Prop = {
  name?: string,
  value?: unknown
};

export function getPropertyByName<T extends Prop>(props: T[], propertyName: string, defaultValue: T) {
  return props.find(prop => prop.name === propertyName) || defaultValue;
}

export function getPropertyValueByName<T extends Prop>(props: T[], propertyName: string, defaultValue?: unknown) {
  return getPropertyByName(props, propertyName, { value: defaultValue } as Prop).value;
}

export default class GameScene extends Phaser.Scene {
  map: Phaser.Tilemaps.Tilemap;

  player!: Player;

  playerStartPosition: number;

  jumpSound: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;

  generatedRight: number;

  generatedLeft: number;

  prevDistance: number;

  escKey: Phaser.Input.Keyboard.Key;

  obstacles: Phaser.Physics.Arcade.Group;

  private controller!: Controller;

  numKeys: any;

  private obstacle!: Obstacle;

  private backgrounds: Phaser.GameObjects.TileSprite[] = [];

  private coins!: Phaser.Physics.Arcade.StaticGroup;

  private scoreLabel!: Phaser.GameObjects.Text;

  private score = 0;

  private isRun = false;

  constructor() {
    super(SceneKey.GameScene);
  }

  init() {
    this.score = 0;
  }

  create() {
    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;
    const groundPosition = CONST.WORLD_GROUND_ROW * CONST.WORLD_BLOCK_SIZE;

    this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, groundPosition);

    // Hill background
    this.backgrounds[0] = this.add.tileSprite(0, 0, screenWidth, screenHeight, TextureKey.HillLayer1).setOrigin(0, 0).setScrollFactor(0, 0);
    this.backgrounds[1] = this.add.tileSprite(0, screenHeight - 100, screenWidth, 258, TextureKey.HillLayer2).setOrigin(0, 1).setScrollFactor(0, 0);
    this.backgrounds[2] = this.add.tileSprite(0, screenHeight - 100, screenWidth, 203, TextureKey.HillLayer3).setOrigin(0, 1).setScrollFactor(0, 0);
    this.backgrounds[3] = this.add.tileSprite(0, groundPosition, screenWidth, 256, TextureKey.HillLayer4).setOrigin(0, 1).setScrollFactor(0, 0);
    this.backgrounds[4] = this.add.tileSprite(0, groundPosition, screenWidth, screenHeight - groundPosition, TextureKey.HillLayer5).setOrigin(0, 0).setScrollFactor(0, 0);


    this.map = this.createMap();
    // this.createBackgroundTileSprite(this.map.images);
    // this.createBackgrounLayers(this.map.layers);
    // this.createGroundLayer('ground', 0, 0);

    this.createPlayer();


    // create obstacle

    this.obstacle = new Obstacle(this, 700, CONST.WORLD_GROUND_ROW * CONST.WORLD_BLOCK_SIZE);
    this.add.existing(this.obstacle);

    this.controller = this.scene.get(SceneKey.ControllerScene) as unknown as Controller; // TODO: fix types

    this.createControls();
    // this.createObstacles();
    // this.createCollaider();
    this.createCamera();
    this.followPlayerRight()
    this.jumpSound = this.sound.add('jump');

    this.generatedRight = this.cameras.main.scrollX;
    this.generatedLeft = this.cameras.main.scrollX;

    this.prevDistance = this.player.x;

    this.data.set('distance', 0);
    this.data.set('beats', 0);

    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC, true, false);

    this.scene.run('ScoreboardScene');


    this.subscribe();

    // new resources

    const scrollX = this.cameras.main.scrollX;
    const scrollY = this.cameras.main.scrollY;
    const texture = this.textures.get('new-bg-layer-1');
    const textureHeight = texture.getSourceImage().height;
    const offsetY = -145;
    // this.add.tileSprite(scrollX, scrollY + screenHeight + offsetY, screenWidth, textureHeight, 'new-bg-layer-1').setOrigin(0, 1);

    this.player.setCollideWorldBounds(true, undefined, undefined, true);
    this.physics.world.on('worldbounds', this.handleWorldbounds, this);

    this.physics.add.collider(
      this.obstacle,
      this.player,
      this.handleObstacleOverlap,
      undefined,
      this
    );

    this.player.once('dead', () => {
      if (!this.scene.isActive(SceneKey.GameoverScene))
        this.scene.run(SceneKey.GameoverScene);
    });

    this.events.once('restart', () => {
      console.log('restart');
      this.scene.restart();
    });

    // UI elements

    // this.scoreLabel = this.add.text(10, 10, `Score: ${this.score}`, {
    //   fontSize: '24px',
    //   color: '#080808',
    //   backgroundColor: '#F8E71C',
    //   shadow: { fill: true, blur: 0, offsetY: 0 },
    //   padding: { left: 15, right: 15, top: 10, bottom: 10 }
    // })
    //   .setScrollFactor(0);

    // Objects

    this.coins = this.physics.add.staticGroup();
    // this.spawnCoins();

    // Overlaps and colliders

    this.physics.add.overlap(this.coins, this.player, this.handleCollectCoin, undefined, this);

    // Timers

    console.log('!!! create !!!');

    this.time.addEvent({
      delay: 8000, // ms
      callback: this.handleRespawnTimer,
      callbackScope: this,
      loop: true
    });

    this.isRun = false;
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

  update(time: number, delta: number) {
    this.updateBackground();
    // this.updateGround();
    this.updatePlayer(time, delta);
    // this.updateObjects();
    this.stabilizeTheCamera();

    const distanceDiff = Math.max(this.player.x - this.prevDistance, 0);
    this.prevDistance = this.player.x;
    this.data.inc('distance', distanceDiff / 70);

    this.wrapObstacle();
    this.obstacle.update();
  }

  updateBackground() {
    this.backgrounds[1].setTilePosition(this.cameras.main.scrollX * 0.1);
    this.backgrounds[2].setTilePosition(this.cameras.main.scrollX * 0.5);
    this.backgrounds[3].setTilePosition(this.cameras.main.scrollX);
    this.backgrounds[4].setTilePosition(this.cameras.main.scrollX);
  }

  createMap() {
    const map = this.add.tilemap('map-level-1');
    map.tilesets.forEach(tileset => map.addTilesetImage(tileset.name, tileset.name));
    return map;
  }

  createBackgroundTileSprite(images: any[]) {
    const width = this.game.config.width;
    const height = this.game.config.height;

    return this.add.group(

      images
        .filter(image => getPropertyValueByName(image.properties, 'class') === 'BackgroundTileSprite')
        .map(image => new BackgroundTileSprite(this, image, width, height))
        .map(layer => this.add.existing(layer)),

      { runChildUpdate: true }

    );
  }

  createBackgrounLayers(layersData: Phaser.Tilemaps.LayerData[]) {
    const width = this.game.config.width;

    return this.add.group(

      layersData
        .filter(layerData => getPropertyValueByName(layerData.properties, 'class') === 'BackgroundLayer')
        .map(layerData => BackgroundLayer.create(this, this.map, layerData.name, 0, 515))
        .map(layer => this.add.existing(layer)),

      { runChildUpdate: true }

    );
  }

  createGroundLayer(layerName: string, x = 0, y = 0) {
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

    this.player.setCollideWorldBounds(true, null, null, true);

    this.physics.world.on('worldbounds', function (body: Phaser.Physics.Arcade.Body) {
      if (body.gameObject === this.player) {
        this.handlePlayerCollideGround();
      }
    }, this);
  }

  createCamera() {
    this.cameras.main.setBackgroundColor('rgba(217, 240, 245, 1)');
    this.cameras.main.zoom = CONST.CAMERA_ZOOM;
  }

  private createPlayer() {
    const ground = CONST.WORLD_GROUND_ROW * CONST.WORLD_BLOCK_SIZE + 64;

    this.player = this.add.existing(new Player(this));
    this.player.setName('The Player');
    this.player.setPosition(0, ground);
    this.player.setBounceX(CONST.PLAYER_BOUNCE_X);
    this.player.data.set(CharAttributes.Health, 1);
    this.player.data.set(CharAttributes.JumpSpeed, CONST.PLAYER_JUMP_VELOCITY);
    this.player.data.set(CharAttributes.JumpTime, CONST.PLAYER_JUMP_MAX_TIME);
    this.player.data.set(CharAttributes.RunSpeed, CONST.PLAYER_RUN_VELOCITY);
    this.player.data.set(CharAttributes.DizzyTime, CONST.PLAYER_DIZZY_TIME);

    this.player.idle();

    this.playerStartPosition = this.player.x;
  }

  createControls() {
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

    if (this.player.direction === Direction.Left && this.generatedRight + max < zero + SPAWN_DISTANCE) {
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

    if (this.player.direction === Direction.Right && this.generatedLeft - max > zero - SPAWN_DISTANCE) {
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
    // const width = this.map.layer.tilemapLayer.width - (this.game.config.width as number);
    // const cameraX = this.cameras.main.scrollX;
    // const offset = cameraX - Math.floor(cameraX / width) * width;
    // this.map.layer.tilemapLayer.x = -offset;
  }

  updatePlayer(time: number, delta: number) {
    this.player.update(time, delta);

    switch (this.player.state) {
      case PlayerState.IDLE:
        if (this.isRun) {
          this.player.run(Direction.Right);
        }
        if (this.controller.isActionDown) {
          this.isRun = true;
          this.player.run();
        }
        break;

      case PlayerState.RUN:
        if (this.controller.isActionDown && this.controller.actionDownDuration <= CONST.PLAYER_JUMP_THRESHOLD) {
          this.player.jump();
        }
        break;

      case PlayerState.JUMP:
        if (this.controller.isActionDown) {
          this.player.jump();
        } else {
          this.player.fly();
        }
        if (this.player.velocityY > 0) {
          this.player.fall();
        }
        break;
    }


    // Control by Arrows

    if (this.controller.isLeftPressed && (this.player.direction !== Direction.Left || this.player.isCurrentState(PlayerState.IDLE))) {
      this.player.direction = Direction.Left;
      this.followPlayerLeft();
      this.player.run(Direction.Left);
    }

    if (this.controller.isRightPressed && (this.player.direction !== Direction.Right || this.player.isCurrentState(PlayerState.IDLE))) {
      this.player.direction = Direction.Right;
      this.followPlayerRight();
      this.player.run(Direction.Right);
    }

    if (
      !this.controller.isRightPressed &&
      !this.controller.isLeftPressed &&
      !this.isRun &&
      this.player.isCurrentState(PlayerState.RUN)) {
      this.player.idle();
    }
  }

  isFalling(object: any) {
    return object.body.velocity.y > START_FALLING_VELOCITY;
  }

  onNumKeyDown(key: any) {
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

  stabilizeTheCamera() {
    const error = CAMERA_STABILIZE_ERROR;
    const focusX = this.cameras.main.scrollX + (this.cameras.main.width / 2 + this.cameras.main.followOffset.x);
    if (Math.abs(this.player.x - focusX) < error) {
      this.cameras.main.setLerp(CAMERA_STABLE_LERP, 0);
    }
  }

  handlePlayerCollideObstacle(player: Player, obstacle: any) {
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

  followPlayer(offsetX: number, offsetY: number) {
    this.cameras.main.startFollow(
      this.player,
      false,
      CONST.CAMERA_LERP, 0,
      offsetX,
      offsetY
    );
    this.cameras.main.scrollY = 0;
  }

  followPlayerRight() {
    this.followPlayer(CONST.CAMERA_PLAYER_POSITION_X, CONST.CAMERA_PLAYER_POSITION_Y);
  }

  followPlayerLeft() {
    this.followPlayer(-CONST.CAMERA_PLAYER_POSITION_X, CONST.CAMERA_PLAYER_POSITION_Y);
  }

  private wrapObstacle() {
    const scrollX = this.cameras.main.scrollX;
    const rightEdge = scrollX + this.scale.width;

    if (this.obstacle.x + this.obstacle.width < scrollX) {
      this.obstacle.move(Phaser.Math.Between(
        rightEdge + this.obstacle.width,
        rightEdge + this.obstacle.width + 1000
      ));
    }
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

  private spawnCoins() {
    // hide all coins
    this.coins.children.each(child => {
      const coin = child as Phaser.Physics.Arcade.Sprite;
      this.coins.killAndHide(coin);
      coin.body.enable = false;
      return true;
    });

    const startGap = 100;
    const scrollX = this.cameras.main.scrollX;
    const rightEdge = scrollX + this.scale.width;
    const numCoins = Phaser.Math.Between(1, 20);

    let x = rightEdge + startGap;

    for (let i = 0; i < numCoins; ++i) {
      const y = Phaser.Math.Between(100, this.scale.height - 100);

      const coin = this.coins.get(
        x, y,
        CONST.SPRITESHEET.OBJECTS,
        7 // frame number
      ) as Phaser.Physics.Arcade.Sprite;

      coin.setVisible(true);
      coin.setActive(true);
      // coin.setOrigin(0.5, 0.5);
      // coin.setOffset(-164, -164)

      // enable phisyc
      const body = coin.body as Phaser.Physics.Arcade.StaticBody;
      body.enable = true;
      body.updateFromGameObject();
      body.setOffset(coin.width / 4, coin.height / 4);
      body.setCircle(body.width * 0.25);

      // next coin position
      x += coin.width * 1.5;
    }
  }

  //
  // Event handlers
  //

  private handleObstacleOverlap() {
    // old version
    // this.player.die();

    // new version
    this.isRun = false;
    this.player.hurt();








    return true;


  }

  private handleCollectCoin(
    obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Tilemaps.Tile,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Tilemaps.Tile
  ) {
    const coin = obj2 as Phaser.Physics.Arcade.Sprite;
    this.coins.killAndHide(coin);
    coin.body.enable = false;
    this.score += 1;
    this.scoreLabel.text = `Score: ${this.score}`;
  }

  private handleRespawnTimer() {
    // console.log('! Timer', this.player.state);
    // if (this.player.state !== Player.STATE_DIE && this.player.state !== Player.STATE_IDLE) {
    //   console.log('! Respawn');
    //   this.spawnCoins();
    // }
  }

  private handleWorldbounds(body: Phaser.Physics.Arcade.Body) {
    if (body.gameObject === this.player) {
      this.handlePlayerCollideGround();
    }
  }

  handlePlayerCollideGround() {
    switch(this.player.state) {
      case PlayerState.FALL:
        this.player.landing();
        break;
      case PlayerState.HURT:
        this.player.dizzy();
        break;
    }
  }
}
