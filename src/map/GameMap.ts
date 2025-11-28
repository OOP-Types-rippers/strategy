import type { ITile } from "../types/ITile";
import type { TerrainType } from "../types/TileTerrain"
import type { IGameMap } from "../types/IGameMap";
import type { IEntity } from "../types/IEntity";
import type { Entity } from "../entities/Entity";
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

    moveEntity(fromX: number, fromY: number, toX : number, toY: number) : void {
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

    placeBuilding(x: number, y: number, building: IBuilding) : void {
        const tile = this.getTile(x, y);
        if (tile) {
            tile.building = building;
        } else {
            console.error(`Unable to place entity: ${building}`);
        }
    }

    getDistance(startX: number, startY: number, endX: number, endY: number) : number {
        if (startX < 0 || startY < 0 || endX < 0 || endY < 0 || startX >= this.width || startY >= this.height || endX >= this.width || endY >= this.height) {
            return -1;
        }

        if (startX == endX && startY == endY) {
            return 0;
        }

        const isVisited: boolean[][] = [];

        for (let y = 0; y < this.height; y++) {
            isVisited[y] = []
            for (let x = 0; x < this.width; x++) {
                isVisited[y]![x] = false;
            }
        }

        const queue: { x: number; y: number; dist: number }[] = [];
        queue.push({ x: startX, y: startY, dist: 0 });

        isVisited[startY]![startX] = true;

        const directions = [{dx: 1, dy: 0}, {dx: -1, dy: 0}, {dx: 0, dy: 1}, {dx: 0, dy: -1}];

        while (queue.length > 0) {
            const {x, y, dist} = queue.shift()!;

            for (const dir of directions) {
                const nx = x + dir.dx;
                const ny = y + dir.dy;

                if(nx < 0 || ny < 0 || nx >= this.width || ny >= this.height) {
                    continue;
                }

                if (isVisited[ny]![nx]) {
                    continue;
                }

                isVisited[ny]![nx] = true;

                if (nx === endX && ny === endY) {
                    return dist + 1;
                }

                queue.push({ x: nx, y: ny, dist: dist + 1 });
            }
        }

        return -1;

    }

    getDistanceUnitTile(fromEntity: Entity, endX : number, endY : number) : number {
        const startX: number = fromEntity.PosX;
        const startY: number = fromEntity.PosY;

        return this.getDistance(startX, startY, endX, endY);
    }

    getDistanceUnitUnit(fromEntity: IEntity, toEntity: IEntity) : number {
        const startX : number = fromEntity.PosX;
        const startY: number = fromEntity.PosY;
        const endX : number = toEntity.PosX;
        const endY: number = toEntity.PosY;

        return this.getDistance(startX, startY, endX, endY);
    }

    print() : void {
        for (const row of this.grid) {
            console.log(row.map(t => t.terrain[0]!.toUpperCase()).join(" "));
        }
    }

    clear() : void {
        this.grid.length = 0;
        this.width = 0;
        this.height = 0;
    }
}
