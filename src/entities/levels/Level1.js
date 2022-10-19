import LEVEL_1_MAP_JSON from '../../../assets/map/level-1-map.json';
import LEVEL_1_TILESET_PNG from '../../../assets/images/level-1-tileset.png';

export default class Level1 {
  static mapName = 'level-1';

  static tilesetName = 'level-1-tileset';
  static tilesetImage = 'level-1-tileset-png';
  static tileSize = 128;

  static chunks = ['chunk-1', 'chunk-2', 'chunk-3'];
  static chunkSize = 16 * Level1.tileSize;
  static groundPosition = 11 * Level1.tileSize;

  static preload(scene) {
    scene.load.image(Level1.tilesetImage, LEVEL_1_TILESET_PNG);
    scene.load.tilemapTiledJSON(Level1.mapName, LEVEL_1_MAP_JSON);
  }
}
