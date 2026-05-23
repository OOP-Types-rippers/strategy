import { IFaction } from "./IFaction";
import { IRenderer } from "./IRenderer";

// This interface is used by GameController to render game state as well as captions (win conditions)
export interface IMasterRenderer extends IRenderer {
  caption(winner: IFaction | null, turns: number): void;
}
