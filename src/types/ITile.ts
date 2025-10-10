import {TerrainType} from "./TileTerrain";

export interface ITile {
    terrain: TerrainType;
    moveCost: number;
    defenseBonus: number;
}
