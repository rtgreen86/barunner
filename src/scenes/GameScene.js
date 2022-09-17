import Phaser from 'Phaser';

import Obstacle from '../entities/Obstacle';
import Player from '../entities/Player';
import PlayerController from '../entities/PlayerController';
import BackgroundLayer from '../entities/BackgroundLayer';

import { createAnimationConfig } from '../entities/SpriteSheetParser';

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
    this.spawnedObject = 500;
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

    this.createBackgound();
    this.createGround();
    this.createObstacles();

    this.createPlayer();
    this.createCollaider();
    this.createCamera();


    const mappy = this.add.tilemap('mappy')

    console.info('DEBUG', mappy.currentLayerIndex);
    console.info('DEBUG', mappy.height);
    console.info('DEBUG', mappy.width);


    // map 64

    // const terrain = mappy.addTilesetImage('tiles-map-5', 'terrain');
    // const layer = mappy.createStaticLayer('foreground-1', [terrain], 0, -640);
    // this.physics.add.collider(this.player, this.layer);
    // layer.setCollisionByProperty({ collides: true });
    // layer.setCollisionByProperty({ collide: true });
    // layer.setCollisionByExclusion(-1, true);
    //layer.setCollision([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]);
    // this.physics.add.collider(this.player, layer);

    // const map = this.make.tilemap({ key: 'mappy', tileWidth: 64, tileHeight: 64 });
    // const map = this.make.tilemap({ key: 'mappy' });
    // const tileset1 = map.addTilesetImage('terrain');
    // const tileset = map.addTilesetImage('tiles-map-5', 'terrain');
    // const platforms = map.createStaticLayer('foreground-1', tileset, 0, 200);
    // var layer1 = map.createLayer(10, tileset, 0, 0); // layer index, tileset, x, y


    // New big map level 1


    const mapLevel1 = this.add.tilemap('map-level-1')
    const tilesLevel1 = mapLevel1.addTilesetImage('level-1-tileset', 'tileset-level-1'); // fix names
    const layer1 = mapLevel1.createStaticLayer('chunk-1', [tilesLevel1], 0, -1450);
    this.physics.add.collider(this.player, this.layer1);
    layer1.setCollisionByProperty({ collides: true });
    // layer.setCollisionByProperty({ collide: true });
    // layer.setCollisionByExclusion(-1, true);
    //layer.setCollision([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]);
    this.physics.add.collider(this.player, layer1);



    this.jumpSound = this.sound.add('jump');
  }

  createCamera() {
    this.cameras.main.setBackgroundColor('rgba(217, 240, 245, 1)');
    this.cameras.main.startFollow(
      this.player,
      false,
      0.2, 0,
      -200, 50
    );
    this.cameras.main.zoom = 1;
  }

  createCollaider() {
    // Do not collide with obstacles
    // this.physics.add.collider(this.player, this.obstacles, null, this.onFacedObstacle, this);


    // this.physics.add.collider(this.ground, this.player);
    // this.physics.add.collider(this.ground, this.obstacles);
  }

  createAnimation() {
    const data = this.cache.json.get('spritesheet-64-tiles');

    data.forEach((tile) => {
      if (tile.type !== 'animation') return;

      const frames = tile.animation.map(frame => frame.tileid);



      const animationProps = tile.properties.reduce((props, prop) => {
        props[prop.name] = prop.value;
        return props;
      }, {
        frames: this.anims.generateFrameNumbers('spritesheet-64', { frames })
      });
      this.anims.create(animationProps);
    });

    // const ramAnimationConfig = createAnimationConfig(this.cache.json.get('ram-spritesheet-data-128.json'));
    // ramAnimationConfig.forEach(anim => this.anims.create(anim));

    this.anims.createFromAseprite('ram-spritesheet');
    this.anims.get('Ram Dash').repeat = -1;
    this.anims.get('Ram Idle').repeat = -1;
    this.anims.get('Ram Dizzy').repeat = -1;
    this.anims.get('Ram Hurt').repeat = -1;
    this.anims.get('Ram Takeoff Run').repeat = -1;
    this.anims.get('Ram Jump').repeat = -1;
    this.anims.get('Ram Run').repeat = -1;
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

  createObstacles() {
    this.obstacles = this.physics.add.group();
  }

  createPlayer() {
    this.player = new Player(this, 350, -275 - 15, 'ram-spritesheet-128.png', 3 /* framenum */, this.controller).setDepth(50).setBounceX(0);
    // this.player = new Player(this, 0, 0, 'spritesheet-small', 1, this.controller).setDepth(50).setBounceX(0);
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

    // Do not update background
    // this.updateBackground();
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
