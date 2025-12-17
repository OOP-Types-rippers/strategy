import { IGameState } from "./IGameState";

export interface IGameSaver {
  save(state: IGameState, name: string): boolean;
  load(name: string): IGameState;
  delete(name: string): boolean;
}
