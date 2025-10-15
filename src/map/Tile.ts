import type { ITile } from "../types/ITile";
import type { TerrainType } from "../types/TileTerrain";
import type { IEntity } from "../types/IEntity";
import type { IBuilding } from "../types/IBuilding";

const terrainStats = {
  road: { moveCost: 1, defenseBonus: 0 },
  grass: { moveCost: 1, defenseBonus: 1 },
  hill: { moveCost: 2, defenseBonus: 1 },
  forest: { moveCost: 2, defenseBonus: 2 },
  mountain: { moveCost: 3, defenseBonus: 3 },
  water: { moveCost: 3, defenseBonus: 0 },
}

export class Tile implements ITile {
  terrain: TerrainType;
  unit: IEntity | null;
  building: IBuilding | null;

  constructor(terrain: TerrainType) {
    this.terrain = terrain;
    this.unit = null;
    this.building = null;
  }

  get moveCost(): number {
    return terrainStats[this.terrain].moveCost;
  }

  get defenseBonus(): number {
    return terrainStats[this.terrain].defenseBonus;
  }
}
