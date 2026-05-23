import { IFaction } from "./IFaction";
import { IGameState } from "./IGameState";

export interface IRenderer {
  render(state: IGameState): void;
}
