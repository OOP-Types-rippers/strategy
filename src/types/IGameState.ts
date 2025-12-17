import { IFactionState } from "./IFaction";
import { IGameMapState } from "./IGameMap";

export interface IGameState {
  map: IGameMapState;
  factions: IFactionState[];
  currentFaction: string;
  turn: number;
}
