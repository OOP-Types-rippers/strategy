import { TerrainType } from "./Terrain";

export interface ITile {
  terrain: TerrainType;
  moveCost: number;
  defenseBonus: number;
}
