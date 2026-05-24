import { Entity } from "../../../../src/entities/Entity";
import { GameMap } from "../../../../src/map/GameMap";
import { IGameState } from "../../../../src/types/IGameState";
import { IRenderer } from "../../../../src/types/IRenderer";
import { ITileState } from "../../../../src/types/ITile";

export class CanvasHighlightRenderer implements IRenderer {
  constructor(
    private _context: CanvasRenderingContext2D,
    private _tileSize: number,
  ) {}

  public render(state: IGameState): void {
    const selection = state.selection;
    if (!selection) return;

    const selectedTile = state.map.grid[selection.y]?.[selection.x];
    if (!selectedTile) return;

    if (selectedTile.unit?.faction === state.currentFaction) {
      this.drawActionHighlights(state, selectedTile, selection.x, selection.y);
    }

    this.drawSelectedTile(selection.x, selection.y);
  }

  public set tileSize(tileSize: number) {
    this._tileSize = tileSize;
  }

  public set context(context: CanvasRenderingContext2D) {
    this._context = context;
  }

  private drawActionHighlights(
      state: IGameState,
      selectedTile: ITileState,
      selectedX: number,
      selectedY: number,
      ): void {
    const selectedUnit = selectedTile.unit;
    if (!selectedUnit) return;

    const distances = this.calculateDistanceMap(state);

    for (let y = 0; y < state.map.height; y++) {
      for (let x = 0; x < state.map.width; x++) {
        if (x === selectedX && y === selectedY) continue;

        const tile = state.map.grid[y]?.[x];
        if (!tile) continue;

        const distance = distances[y]?.[x] ?? Infinity;

        if (selectedUnit.canMove && !tile.unit && distance <= selectedUnit.movepoints) {
          this.drawMoveTile(x, y);
        }

        const attackDistance = Math.abs(selectedX - x) + Math.abs(selectedY - y);

        if (
          selectedUnit.canAttack
          && attackDistance === 1
          && tile.unit
          && tile.unit.faction !== state.currentFaction
        ) {
          this.drawAttackTile(x, y);
        }
      }
    }
  }

  private calculateDistanceMap(state: IGameState): number[][] {
    const map = new GameMap(state.map.width, state.map.height);
    map.restoreFromState(state.map, { factions: [] });

    const startX = state.selection!.x;
    const startY = state.selection!.y;  

    const distances = map.grid.map((row, y) => row.map((tile, x) => map.getDistance(startX, startY, x, y)));
    return distances;
  }

  private drawSelectedTile(x: number, y: number): void {
    const pxX = x * this._tileSize;
    const pxY = y * this._tileSize;
    const inset = Math.max(2, this._tileSize * 0.08);

    this._context.fillStyle = "rgba(255, 255, 255, 0.18)";
    this._context.fillRect(pxX, pxY, this._tileSize, this._tileSize);

    this._context.strokeStyle = "#f8fafc";
    this._context.lineWidth = Math.max(2, this._tileSize * 0.08);
    this._context.strokeRect(
      pxX + inset,
      pxY + inset,
      this._tileSize - inset * 2,
      this._tileSize - inset * 2,
    );
  }

  private drawMoveTile(x: number, y: number): void {
    const pxX = x * this._tileSize;
    const pxY = y * this._tileSize;
    const radius = Math.max(3, this._tileSize * 0.12);

    this._context.fillStyle = "rgba(74, 222, 128, 0.22)";
    this._context.fillRect(pxX, pxY, this._tileSize, this._tileSize);

    this._context.fillStyle = "rgba(22, 101, 52, 0.65)";
    this._context.beginPath();
    this._context.arc(pxX + this._tileSize / 2, pxY + this._tileSize / 2, radius, 0, Math.PI * 2);
    this._context.fill();
  }

  private drawAttackTile(x: number, y: number): void {
    const pxX = x * this._tileSize;
    const pxY = y * this._tileSize;
    const inset = Math.max(3, this._tileSize * 0.12);

    this._context.fillStyle = "rgba(239, 68, 68, 0.28)";
    this._context.fillRect(pxX, pxY, this._tileSize, this._tileSize);

    this._context.strokeStyle = "rgba(127, 29, 29, 0.85)";
    this._context.lineWidth = Math.max(2, this._tileSize * 0.07);
    this._context.beginPath();
    this._context.moveTo(pxX + inset, pxY + inset);
    this._context.lineTo(pxX + this._tileSize - inset, pxY + this._tileSize - inset);
    this._context.moveTo(pxX + this._tileSize - inset, pxY + inset);
    this._context.lineTo(pxX + inset, pxY + this._tileSize - inset);
    this._context.stroke();
  }
}
