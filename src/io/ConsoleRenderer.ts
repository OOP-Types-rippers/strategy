import { IGameState } from "../types/IGameState";
import { IRenderer } from "../types/IRenderer";

export class ConsoleRenderer implements IRenderer {
  render(state: IGameState) {
    console.log(state)
  }
}
