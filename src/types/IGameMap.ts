import { IBuilding } from "./IBuilding";
import { IEntity } from "./IEntity";
import { IRestoreContext } from "./IRestoreContext";
import { ITile, ITileState } from "./ITile";
import { TerrainType } from "./Terrain";

export interface IGameMapState {
  width: number
  height: number
  grid: ITileState[][]
}
export interface IGameMap {
  width: number
  height: number
  grid: ITile[][]
  
  getTile(x: number, y: number): ITile
  setTile(x: number, y: number, terrain: TerrainType): void

  getState(): IGameMapState
  restoreFromState(state: IGameMapState, context: IRestoreContext): void
  
  placeEntity(x: number, y: number, entity: IEntity): void
  removeEntity(x: number, y: number): void
  moveEntity(entity: IEntity, toX: number, toY: number): void
  placeBuilding(x: number, y: number, building: IBuilding): void
  print(): void
  clear(): void
}
