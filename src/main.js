import {
  Game,
  AUTO
} from 'Phaser';

import './main.css';
import Images from '../assets/grafika.png';

import GameScene from './scenes/GameScene';

const scene = new GameScene();

new Game({
  type: AUTO,
  width: 1024,
  height: 600,
  scene,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: {
        x: 0,
        y: 500
      }
    }
  }
});

// TODO: cleanup old code
// Next code used to show barraner demo

(function () {
  /*

  Model

  */

  function Model() {
    this.fps = 0;
    this.clouds = 0;
    this.state = 'stoped';
    this.lastFpsUpdate = null;
    this.lastCloudUpdate = null;
    this.frames = 0;
  }

  Model.prototype.updateFps = function (time) {
    this.frames++;
    if (this.lastFpsUpdate === null) {
      this.lastFpsUpdate = time;
    }
    if (time - this.lastFpsUpdate < 1000) {
      return;
    }
    this.fps = this.frames / ((time - this.lastFpsUpdate) / 1000);
    this.frames = 0;
    this.lastFpsUpdate = time;
  }

  Model.prototype.doubleClouds = function (time) {
    if (this.lastCloudUpdate === null) {
      this.lastCloudUpdate = time;
    }
    if (time - this.lastCloudUpdate < 10000) {
      return;
    }
    this.clouds *= 2;
    this.lastCloudUpdate = time;
  }

  Model.prototype.tick = function (time) {
    this.updateFps(time);
  };

  var model = new Model();

  /*

  Game

  */


  // --- Bitmap Resource

  var bitmapResource = {
    path: Images,
    width: 320,
    height: 1120,
    objects: {
      'sheep': {
        width: '80px',
        height: '80px',
        resourceWidth: 160,
        resourceHeight: 560,
        frames: [
          { x: 0, y: 0 },
          { x: 80, y: 0 },
          { x: 0, y: -80 },
          { x: 80, y: -80 },
          { x: 0, y: -160 },
          { x: 80, y: -160 }
        ]
      },
      'layer1': {
        width: '100%',
        height: '160px',
        frames: [{ x: 0, y: -640 }]
      },
      'layer2': {
        width: '100%',
        height: '160px',
        frames: [{ x: 0, y: -800 }]
      },
      'layer3': {
        width: '100%',
        height: '160px',
        frames: [{ x: 0, y: -960 }]
      },
      'cloud1': {
        width: '160px',
        height: '160px',
        frames: [
          { x: 0, y: -480}
        ]
      },
      'cloud2': {
        width: '160px',
        height: '160px',
        frames: [
          { x: 160, y: -480}
        ]
      }
    }
  }


  // --- resource utils ---

  function getSpriteStyles(resource, name, frame, offset) {
    return {
      position: 'absolute',
      backgroundImage: 'url(' + resource.path + ')',
      backgroundSize:
        (resource.objects[name].resourceWidth !== undefined
          ? resource.objects[name].resourceWidth
          : resource.width) + 'px ' +
        (resource.objects[name].resourceHeight !== undefined
          ? resource.objects[name].resourceHeight
          : resource.height) + 'px ',
      width: resource.objects[name].width,
      height: resource.objects[name].height,
      backgroundPosition:
        (resource.objects[name].frames[frame].x + offset) + 'px ' +
        resource.objects[name].frames[frame].y + 'px'
    };
  }

  function applySpriteStyles(spriteElement, styles) {
    for (var prop in styles) {
      if (!styles.hasOwnProperty(prop)) continue;
      spriteElement.style[prop] = styles[prop];
    }
  }


  // --- Background Layer ---

  function BackgroundLayer(screen, resource, name) {
    this.element = document.createElement('div');
    this.element.style.bottom = '0px';
    this.element.style.left = '0px';
    screen.append(this.element);
    this.resource = resource;
    this.name = name;
    this.lastRenderTime = null;
    this.direction = 'left';
    this.speed = 0;
    this.offset = 0;
  }

  BackgroundLayer.prototype.tick = function (time) {
    if (this.lastRenderTime === null) {
      this.lastRenderTime = time;
      return;
    }
    var passedTime = time - this.lastRenderTime;
    var delta = this.speed * (passedTime / 1000);
    this.offset = this.direction === 'left'
      ? this.offset - delta
      : this.offset + delta;
    var layerWidth = this.resource.width;
    while (this.offset > layerWidth) this.offset = this.offset - layerWidth;
    while (this.offset < 0) this.offset = this.offset + layerWidth;
    this.lastRenderTime = time;
    applySpriteStyles(
      this.element,
      getSpriteStyles(this.resource, this.name, 0, this.offset)
    );
  };


  // --- Sprite ---

  function Sprite(screen, resource, name, x, y) {
    this.screen = screen;
    this.element = document.createElement('div');
    this.screen.append(this.element);
    this.resource = resource;
    this.name = name;
    this.lastRenderTime = null;
    this.lastFrameTime = null;
    this.frame = 0;
    this.x = x;
    this.y = y;

    this.moveX = 0;
    this.moveY = 0;
  }

  Sprite.prototype.getScreenWidth = function () {
    var rect = this.screen.getBoundingClientRect();
    return rect.width;
  }

  Sprite.prototype.tick = function (time) {
    if (this.lastRenderTime === null) {
      this.lastRenderTime = time;
      this.lastFrameTime = time;
      return;
    }

    var framePassedTime = time - this.lastFrameTime;
    var frames = this.resource.objects[this.name].frames.length;
    var delta = Math.floor(frames * (framePassedTime / 500));
    if (delta > 0) {
      this.lastFrameTime = time;
    }
    this.frame = this.frame + delta;
    while (this.frame >= frames) this.frame = this.frame - frames;

    var passedTime = time - this.lastRenderTime;
    this.lastRenderTime = time;

    var deltaX = this.moveX * (passedTime / 1000);
    this.x += deltaX;

    var screenWidth = this.getScreenWidth();
    if (this.x < -160) {
      this.x = screenWidth;
    };
    if (this.x < -160 || this.x > screenWidth) {
      this.x = -160;
    };

    var deltaY = this.moveY * (passedTime / 1000);
    this.y += deltaY;

    applySpriteStyles(
      this.element,
      getSpriteStyles(this.resource, this.name, this.frame, 0)
    );
    this.element.style.top = this.y + 'px';
    this.element.style.left = this.x + 'px';
  };

  Sprite.prototype.destroy = function () {
    this.element.remove();
  }

  // --- Background ---

  function Background(screen) {
    this.screen = screen;
    this.layers = [];
    this.speed = 1;
  }

  Background.prototype.tick = function (time) {
    for (var i = 0; i < this.layers.length; i++) {
      this.layers[i].speed = this.speed * i * 300;
      this.layers[i].tick(time);
    }
  }

  // --- Character ---

  function Character(screen, sprite, background) {
    this.screen = screen;
    this.sprite = sprite;
    this.background = background;
    this.x = 0;
    this.y = 280;
    this.lastRenderTime = null;
  }

  Character.prototype.tick = function (time) {
    if (this.lastRenderTime === null) {
      this.lastRenderTime = time;
    }

    var width = this.screen.getBoundingClientRect().width;
    var distance = width / 2 - 40 - this.x; // half sprite size (80)
    var speed = distance / 3000;

    var passedTime = time - this.lastRenderTime;

    if (passedTime > 0) {
      this.x = this.x + (speed * passedTime);
    }

    this.sprite.x = this.x;
    this.sprite.y = this.y;

    if (distance < 0) {
      this.background.speed = 1.3;
    } else {
      this.background.speed = 1;
    }

    this.background.tick(time);
    this.sprite.tick(time);
    this.lastRenderTime = time;
  }

  // --- Game ---

  function Game(screen, model) {
    this.screen = screen;
    this.model = model;
    this.screen.classList.add('sky');

    this.background = new Background(this.screen);
    this.background.layers.push(new BackgroundLayer(
      screen,
      bitmapResource,
      'layer1'
    ));
    this.background.layers.push(new BackgroundLayer(
      screen,
      bitmapResource,
      'layer2'
    ));
    this.background.layers.push(new BackgroundLayer(
      screen,
      bitmapResource,
      'layer3'
    ));

    this.character = new Character(
      this.screen,
      new Sprite(
        screen,
        bitmapResource,
        'sheep',
        0, 280
      ),
      this.background
    )

    this.cloudTypes = [
      'cloud1', 'cloud2'
    ];

    this.clouds = 0;

    this.objects = [
      this.background,
      this.character,
    ];
  }

  Game.prototype.tick = function (time, model) {
    for (var i = 0; i < this.objects.length; i++) {
      this.objects[i].tick(time);
    }
    if (this.clouds < model.clouds) {
      this.randomCloud(model.clouds - this.clouds)
    }
    this.clouds = model.clouds;
  };

  Game.prototype.createCloud = function (altitude, speed) {
    var width = this.screen.getBoundingClientRect().width;
    var type = this.cloudTypes[Math.random() > 0.5 ? 1 : 0];
    var cloud = new Sprite(
      this.screen,
      bitmapResource,
      type,
      width, altitude
    );
    cloud.moveX = speed;
    return cloud;
  }

  Game.prototype.randomCloud = function (amount) {
    var alt, speed;
    for (var i = 0; i < amount; i++) {
      alt = Math.random() * Math.min(this.clouds, 200) - 50;
      speed = Math.random() * -200;
      this.objects.push(this.createCloud(alt, speed));
    }
  }

  /*

  UI

  */

  // --- RenderOnTime ---

  function RenderOnTimer(elements, time) {
    this.elements = elements;
    this.time = time;
    this.renderTime = null;
  }

  RenderOnTimer.prototype.render = function (time) {
    if (
      this.renderTime !== null &&
      time - this.renderTime < this.time
    ) {
      return;
    }
    this.renderTime = time;
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].render.apply(this.elements[i], arguments);
    }
  };


  // --- GameScreen ---

  function GameScreen(view) {
    this.element = document.createElement('div');
    this.element.classList = 'game-screen';
    this.element.id = 'game-screen';
    view.append(this.element);
  };

  GameScreen.prototype.render = function () { }


  // --- View ---

  function View(view, config, getChildren) {
    this.element = document.createElement('div');
    this.element.className = config && config.vertical
      ? 'view vertical'
      : 'view horizontal';
    view.append(this.element);
    this.children = getChildren(this.element);
  };

  View.prototype.render = function () {
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].render.apply(this.children[i], arguments);
    }
  };


  // --- Text ---

  function Text(view, tag, text) {
    this.element = document.createElement(tag);
    this.element.innerText = text;
    view.append(this.element);
  }

  Text.prototype.render = function () { };


  // --- Button ---

  function Button(view, text, handler) {
    this.element = document.createElement('button');
    this.element.textContent = text;
    view.append(this.element);

    var onClick = function (event) {
      event.preventDefault();
      handler(this);
    }.bind(this);

    this.element.addEventListener('click', onClick);

    this.destroy = function() {
      this.element.removeEventListener('click', onClick);
      this.element.remove();
    }
  }

  Button.prototype.render = function () {};


  // --- Change Cloud buttons

  function addCloudController(model, getControl) {
    return getControl(function () {
      model.clouds += 5;
    });
  }

  // --- UI ---

  var ui = new View(
    document.body,
    {
      vertical: true
    },
    function (mainContainer) {
      return [
        new Text(mainContainer, 'H1', 'Тучи сгущаются'),
        new GameScreen(mainContainer),
        new View(
          mainContainer,
          {},
          function (panel) {
            return [
              addCloudController(model, function (handler) {
                return new Button(panel, 'Добавить', handler);
              })
            ]
          }
        )
      ]
    }
  );


  // --- mainLoop ---

  var game = new Game(
    document.getElementById('game-screen'),
    model
  );

  function main(time) {
    requestAnimationFrame(main);
    if (!time) return;

    model.tick(time);
    ui.render(time, { fps: model.fps, clouds: model.clouds });
    game.tick(time, model);
  }

  main();

})();