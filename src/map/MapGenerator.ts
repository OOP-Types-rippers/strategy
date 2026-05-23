import type { TerrainType } from "../types/Terrain";
import { GameMap } from "./GameMap";
import { NoiseFunction } from "./NoiseFunction";

export class MapGenerator {
  private _seed: number;
  private noise: NoiseFunction;

  constructor(seed: number = 42) {
    this._seed = seed;
    this.noise = new NoiseFunction(seed);
  }

  set seed(seed: number) {
    this._seed = seed;
    this.noise = new NoiseFunction(seed);
  }

  get seed() {
    return this._seed;
  }

  public generateMap(width: number, height: number): GameMap {
    const map = new GameMap(width, height);

    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const noiseValue = this.noise.noise2D(x / 10, y / 10);

        let terrain: TerrainType;
        if (noiseValue < -0.5) {
          terrain = 'water';
        } else if (noiseValue < -0.2) {
          terrain = 'road';
        } else if (noiseValue < 0.0) {
          terrain = 'grass';
        } else if (noiseValue < 0.3) {
          terrain = 'forest';
        } else if (noiseValue < 0.6) {
          terrain = 'mountain';
        } else {
          terrain = 'hill';
        }

        map.setTile(x, y, terrain);
      }
    }

    return map;
  }
}
