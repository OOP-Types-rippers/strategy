import { GameMap } from "./GameMap";
import { TerrainType } from "../types/TileTerrain";
import { Tile } from "./Tile";
import { Seed } from './Seed'
import { NoiseFunction } from "./NoiseFunction";

export class MapGenerator {
    private readonly gameMap : GameMap;
    private noise: NoiseFunction;
    private readonly seed: number;

    constructor(private width : number, private height : number, private defaultTerrain: TerrainType = 'grass', seed ?: number) {
        const seedGen = new Seed();
        this.seed = seed ?? seedGen.generate();

        this.noise = new NoiseFunction(this.seed);

        const grid = Array.from({ length: height }, () => Array.from({ length: width }, () => new Tile(defaultTerrain)));

        this.gameMap = new GameMap(width, height, grid, this.seed);
    }

    buildMap() : void {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const noiseValue = this.noise.noise2D(x / 10, y / 10);

                let terrain: TerrainType;
                if (noiseValue < -0.5) {
                    terrain = 'water';
                } else if (noiseValue < -0.2) {
                    terrain = 'road';
                } else if (noiseValue < 0.0) {
                    terrain = 'grass';
                } else if (noiseValue > 0.3) {
                    terrain = 'forest';
                } else if (noiseValue > 0.6) {
                    terrain = 'hill';
                } else {
                    terrain = 'mountain';
                }

                this.gameMap.setTile(x, y, terrain);
            }
        }
    }

    getMap() : GameMap {
        return this.gameMap;
    }
}