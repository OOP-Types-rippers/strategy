import { IGameState } from "../../../../src/types/IGameState";
import { IRenderer } from "../../../../src/types/IRenderer";

export class CanvasEntityRenderer implements IRenderer {
  constructor(
    private _context: CanvasRenderingContext2D,
    private _tileSize: number,
  ) {}

  public render(state: IGameState): void {
    // TODO
  }

  public set tileSize(tileSize: number) {
    this._tileSize = tileSize;
  }

  public set context(context: CanvasRenderingContext2D) {
    this._context = context;
  }
}
