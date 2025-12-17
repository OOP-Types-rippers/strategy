import type { ITile } from "../types/ITile";
import type { TerrainType } from "../types/Terrain"
import type { IGameMap, IGameMapState } from "../types/IGameMap";
import type { IEntity } from "../types/IEntity";
import type { IBuilding } from "../types/IBuilding";
import { Tile } from "./Tile";
import { IRestoreContext } from "../types/IRestoreContext";

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

  setRow(defaultTerrain: TerrainType): void {
    const newRow: ITile[] = [];
    for (let x = 0; x < this.width; x++) {
      newRow.push(new Tile(defaultTerrain));
    }
    this.grid.push(newRow);
    this.height++;
  }

  setCol(defaultTerrain: TerrainType): void {
    for (let y = 0; y < this.height; y++) {
      const newTile = new Tile(defaultTerrain);
      this.grid[y]!.push(newTile);
    }
    this.width++;
  }

  placeEntity(x: number, y: number, entity: IEntity): void {
    const tile = this.getTile(x, y);
    if (tile) {
      tile.unit = entity;
    } else {
      console.error(`Unable to place entity: ${entity}`);
    }
  }

  moveEntity(fromX: number, fromY: number, toX: number, toY: number, entity: IEntity): void {
    const fromTile = this.getTile(fromX, fromY);
    const toTile = this.getTile(toX, toY);
    if (!fromTile.unit) {
      console.error(`No entity found at ${fromX}, ${fromY} to move.`);
      return;
    }
    if (toTile.unit) {
      console.error(`Tile ${toX}, ${toY} already occupied by another entity.`);
      return;
    }

    toTile.unit = fromTile.unit;
    fromTile.unit = null;
  }

  placeBuilding(x: number, y: number, building: IBuilding): void {
    const tile = this.getTile(x, y);
    if (tile) {
      tile.building = building;
    } else {
      console.error(`Unable to place entity: ${building}`);
    }
  }

  print(): void {
    for (const row of this.grid) {
      console.log(row.map(t => t.terrain[0]!.toUpperCase()).join(" "));
    }
  }

  clear(): void {
    this.grid.length = 0;
    this.width = 0;
    this.height = 0;
  }

  getState(): IGameMapState {
    const grid = this.grid.map(row => row.map(tile => tile.getState()));
    return {
      width: this.width,
      height: this.height,
      grid,
    };
  }

  restoreFromState(state: IGameMapState, context: IRestoreContext): void {
    this.width = state.width;
    this.height = state.height;

    this.grid = state.grid.map(row => row.map(tileState => {
      const tile = new Tile();
      tile.restoreFromState(tileState, context);
      return tile;
    }));
  }
}
