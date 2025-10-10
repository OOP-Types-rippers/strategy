import { IFaction } from "./IFaction";
import { IGameMap } from "./IGameMap";

export interface IGameState {
  map: IGameMap;
  factions: IFaction[];
  currentFaction: IFaction;
}
