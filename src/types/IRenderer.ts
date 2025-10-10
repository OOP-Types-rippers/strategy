import { IGameState } from "./IGameState";

export interface IRenderer {
  render(state: IGameState): void
}
