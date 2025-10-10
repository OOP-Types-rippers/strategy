import { IGameState } from "../types/IGameState";
import { IRenderer } from "../types/IRenderer";

class ConsoleRenderer implements IRenderer {
  render(state: IGameState) {
    console.log(state)
  }
}
