import { TerrainType } from "./TileTerrain";
import { IEntity } from "./IEntity";
import { IBuilding } from "./IBuilding";

export interface ITile {
  terrain: TerrainType;
  moveCost: number;
  defenseBonus: number;
  unit: IEntity | null;
  building: IBuilding | null;
}
