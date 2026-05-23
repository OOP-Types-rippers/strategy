import type { ITile } from "../types/ITile";
import type { IEntity } from "../types/IEntity";
import type { Entity } from "../entities/Entity";
import type { TerrainType } from "../types/Terrain"
import type { IGameMap, IGameMapState } from "../types/IGameMap";
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

        this.grid = Array.from({ length: height }, () =>
            Array.from({ length: width }, () => new Tile(defaultTerrain))
        );
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
        entity.setPos(x, y);
    }

    removeEntity(x: number, y: number): void {
        const tile = this.getTile(x, y);
        if (tile) {
            tile.unit = null;
        }
    }

    moveEntity(entity: IEntity, toX : number, toY: number) : void {
        const fromTile = this.getTile(entity.PosX, entity.PosY);
        const toTile = this.getTile(toX, toY);

        if (!fromTile.unit) {
            console.error(`No entity found at ${entity.posX}, ${entity.posY} to move.`);
            return;
        }
        if (toTile.unit) {
            console.error(`Tile ${toX}, ${toY} already occupied by another entity.`);
            return;
        }

        toTile.unit = fromTile.unit;
        fromTile.unit = null;

        entity.setPos(toX, toY);
    }

    placeBuilding(x: number, y: number, building: IBuilding): void {
        const tile = this.getTile(x, y);
        if (tile) {
            tile.building = building;
        } else {
            console.error(`Unable to place entity: ${building}`);
        }
    }

    getDistance(startX: number, startY: number, endX: number, endY: number): number {
        if (startX < 0 || startY < 0 || endX < 0 || endY < 0 || startX >= this.width || startY >= this.height || endX >= this.width || endY >= this.height) {
            return -1;
        }

        if (startX == endX && startY == endY) {
            return 0;
        }

        const distances: number[][] = [];
        for (let y = 0; y < this.height; y++) {
            distances[y] = [];
            for (let x = 0; x < this.width; x++) {
                distances[y]![x] = Infinity;
            }
        }

        const queue: { x: number; y: number; cost: number }[] = [];
        distances[startY]![startX] = 0;
        queue.push({ x: startX, y: startY, cost: 0 });

        const directions = [{ dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }];

        while (queue.length > 0) {
            queue.sort((a, b) => a.cost - b.cost);
            const { x, y, cost } = queue.shift()!;

            if (cost > distances[y]![x]!) {
                continue;
            }

            if (x === endX && y === endY) {
                return cost;
            }

            for (const dir of directions) {
                const nx = x + dir.dx;
                const ny = y + dir.dy;

                if (nx < 0 || ny < 0 || nx >= this.width || ny >= this.height) {
                    continue;
                }

                const newCost = cost + this.getTile(nx, ny).moveCost;

                if (newCost < distances[ny]![nx]!) {
                    distances[ny]![nx] = newCost;
                    queue.push({ x: nx, y: ny, cost: newCost });
                }
            }
        }

        return -1;
    }

    getDistanceUnitTile(fromEntity: Entity, endX: number, endY: number): number {
        const startX: number = fromEntity.PosX;
        const startY: number = fromEntity.PosY;

        return this.getDistance(startX, startY, endX, endY);
    }

    getDistanceUnitUnit(fromEntity: IEntity, toEntity: IEntity): number {
        const startX: number = fromEntity.PosX;
        const startY: number = fromEntity.PosY;
        const endX: number = toEntity.PosX;
        const endY: number = toEntity.PosY;

        return this.getDistance(startX, startY, endX, endY);
    }

    getUnit(x: number, y: number) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return null;
        }
        return this.getTile(x, y).unit;
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
