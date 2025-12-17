import type { ITile, ITileState } from "../types/ITile";
import type { TerrainStats, TerrainType } from "../types/Terrain";
import type { IEntity } from "../types/IEntity";
import type { IBuilding } from "../types/IBuilding";
import type { IRestoreContext } from "../types/IRestoreContext";
import { Entity } from "../entities/Entity";

const terrainStats: TerrainStats = {
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

  constructor(terrain?: TerrainType) {
    this.terrain = terrain ?? "grass";
    this.unit = null;
    this.building = null;
  }

  get moveCost(): number {
    return terrainStats[this.terrain].moveCost;
  }

  get defenseBonus(): number {
    return terrainStats[this.terrain].defenseBonus;
  }

  getState(): ITileState {
    return {
      terrain: this.terrain,
      unit: this.unit?.getState() ?? null,
      building: null, // replace later
    };
  }

  restoreFromState(tileState: ITileState, context: IRestoreContext): void {
    this.terrain = tileState.terrain;
    if (tileState.unit) {
      this.unit = new Entity();
      this.unit.restoreFromState(tileState.unit, context);
    } else {
      this.unit = null;
    }
    this.building = null; // replace later
  }
}