import type { ITile } from "../types/ITile";
import type { TerrainType } from "../types/TileTerrain"
import type { IGameMap } from "../types/IGameMap";

import { Tile } from "./Tile";

export class GameMap implements IGameMap {
  width: number;
  height: number;
  grid: ITile[][];

  constructor(width: number, height: number, defaultTerrain: TerrainType = 'grass') {
    this.width = width;
    this.height = height;
    this.grid = [];

    for (let y = 0; y < height; y++) {
      const row: ITile[] = [];
      for (let x = 0; x < width; x++) {
        row.push(new Tile(defaultTerrain));
      }
      this.grid.push(row);
    }
  }

  getTile(x: number, y: number): ITile {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      throw new Error(`Tile (${x}, ${y}) is not a valid tile`);
    }
    return this.grid[y]![x]!;
  }

  setTile(x: number, y: number, terrain: TerrainType): void {
    const tile = this.getTile(x, y);
    if (tile) {
      tile.terrain = terrain;
    }
  }
}