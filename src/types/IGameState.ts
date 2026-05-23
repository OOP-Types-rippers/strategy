import { IFactionState } from "./IFaction";
import { IGameMapState } from "./IGameMap";

export interface IGameState {
  map: IGameMapState;
  factions: IFactionState[];
  currentFaction: string;
  selection: {x: number, y: number}; 
  turn: number;
}
