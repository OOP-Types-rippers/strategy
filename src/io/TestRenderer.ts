import { IFaction } from "../types/IFaction";
import { IGameState } from "../types/IGameState";
import { IRenderer } from "../types/IRenderer";

export class TestRenderer implements IRenderer {
  render(state: IGameState): void {}
  caption(winner: IFaction | null, turns: number): void {}
}