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
  moveEntity(fromX: number, fromY: number, toX: number, toY: number, entity: IEntity): void
  placeBuilding(x: number, y: number, building: IBuilding): void
  print(): void
  clear(): void
}
