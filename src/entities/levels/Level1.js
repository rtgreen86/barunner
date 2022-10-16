import LEVEL_1_MAP_JSON from '../../../assets/map/level-1-map.json';
import LEVEL_1_TILESET_PNG from '../../../assets/images/level-1-tileset.png';

export default class Level1 {
  static tilesetName = 'level-1-tileset';
  static tilesetImage = 'level-1-tileset-png';
  static mapName = 'level-1-map-json';

  static availableChunks = ['chunk-1', 'chunk-2', 'chunk-3'];

  constructor(scene) {
    this.scene = scene;

    this.mapTileSize = 128;
    this.mapGroundPosition = 11 * this.mapTileSize;
    this.mapChunkSize = 16 * this.mapTileSize;

    this.tilemap = this.scene.add.tilemap(Level1.mapName);
    this.tilesImages = this.tilemap.addTilesetImage(Level1.tilesetName, Level1.tilesetImage);
    this.mapChunks = [
      this.tilemap.createLayer(Level1.availableChunks[0], [this.tilesImages], 0, 0),
      this.tilemap.createStaticLayer('chunk-2', [this.tilesImages], 16*128, 0),
      // this.tilemap.createStaticLayer('chunk-3', [this.tilesImages], 16*128*2, 0)
    ];
  }

  static preload(scene) {
    scene.load.image(Level1.tilesetImage, LEVEL_1_TILESET_PNG);
    scene.load.tilemapTiledJSON(Level1.mapName, LEVEL_1_MAP_JSON);
  }
}
