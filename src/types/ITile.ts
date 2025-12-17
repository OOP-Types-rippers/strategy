import { TerrainType } from "./Terrain";
import { IEntity, IEntityState } from "./IEntity";
import { IBuilding, IBuildingState } from "./IBuilding";
import { IRestoreContext } from "./IRestoreContext";

export interface ITileState {
  terrain: TerrainType;
  unit: IEntityState | null;
  building: IBuildingState | null;
}
export interface ITile {
  terrain: TerrainType;
  moveCost: number;
  defenseBonus: number;
  unit: IEntity | null;
  building: IBuilding | null;

  getState(): ITileState;
  restoreFromState(tileState: ITileState, context: IRestoreContext): void;
}
