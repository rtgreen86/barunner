import LEVEL_1_MAP_JSON from '../../../assets/map/level-1-map.json';
import LEVEL_1_TILESET_PNG from '../../../assets/images/level-1-tileset.png';

export default class Level1 {
  static mapTileSize = 128;
  static mapGroundPosition = 11 * Level1.mapTileSize;
  static mapChunkSize = 16 * Level1.mapTileSize;

  static tilesetName = 'level-1-tileset';
  static tilesetImage = 'level-1-tileset-png';
  static mapName = 'level-1-map-json';

  static availableChunks = ['chunk-1', 'chunk-2', 'chunk-3'];

  static preload(scene) {
    scene.load.image(Level1.tilesetImage, LEVEL_1_TILESET_PNG);
    scene.load.tilemapTiledJSON(Level1.mapName, LEVEL_1_MAP_JSON);
  }
}
