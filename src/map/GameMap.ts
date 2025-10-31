import type { ITile } from "../types/ITile";
import type { TerrainType } from "../types/TileTerrain"
import type { IGameMap } from "../types/IGameMap";
import type { IEntity } from "../types/IEntity";
import type { IBuilding } from "../types/IBuilding";
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

    placeEntity(x: number, y: number, entity: IEntity) : void {
        const tile = this.getTile(x, y);
        if (tile) {
            tile.unit = entity;
        } else {
            console.error(`Unable to place entity: ${entity}`);
        }
    }

    placeBuilding(x: number, y: number, building: IBuilding) : void {
        const tile = this.getTile(x, y);
        if (tile) {
            tile.building = building;
        } else {
            console.error(`Unable to place entity: ${building}`);
        }
    }

    print() : void {
        for (const row of this.grid) {
            console.log(row.map(t => t.terrain[0]!.toUpperCase()).join(" "));
        }
    }

    clearMap() : void {
        this.grid.length = 0;
        this.width = 0;
        this.height = 0;
    }
}
