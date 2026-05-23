import { IGameState } from "../../../../src/types/IGameState";
import { IRenderer } from "../../../../src/types/IRenderer";
import { TerrainType } from "../../../../src/types/Terrain";

export class CanvasTerrainRenderer implements IRenderer {
  constructor(
    private _context: CanvasRenderingContext2D,
    private _tileSize: number,
  ) {}

  public render(state: IGameState): void {
    const { map } = state;

    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const tile = map.grid[y]?.[x];
        if (!tile) continue;

        const pxX = x * this._tileSize;
        const pxY = y * this._tileSize;

        this._context.fillStyle = this.getTerrainColor(tile.terrain);
        this._context.fillRect(pxX, pxY, this._tileSize, this._tileSize);

        this.drawTerrainDetails(tile.terrain, pxX, pxY);
        this.drawGrid(pxX, pxY);
      }
    }
  }

  public set tileSize(tileSize: number) {
    this._tileSize = tileSize;
  }

  public set context(context: CanvasRenderingContext2D) {
    this._context = context;
  }

  private getTerrainColor(terrain: TerrainType): string {
    switch (terrain) {
      case "road":
        return "#b49a70";
      case "grass":
        return "#7eb96f";
      case "forest":
        return "#3f7f4a";
      case "hill":
        return "#9fa866";
      case "mountain":
        return "#8b8f94";
      case "water":
        return "#4a90c2";
    }
  }

  private drawGrid(x: number, y: number): void {
    this._context.strokeStyle = "rgba(31, 41, 55, 0.24)";
    this._context.lineWidth = 1;
    this._context.strokeRect(x + 0.5, y + 0.5, this._tileSize - 1, this._tileSize - 1);
  }

  private drawTerrainDetails(terrain: TerrainType, x: number, y: number): void {
    const size = this._tileSize;
    const centerX = x + size / 2;
    const centerY = y + size / 2;

    switch (terrain) {
      case "road":
        this._context.strokeStyle = "rgba(255, 246, 218, 0.5)";
        this._context.lineWidth = Math.max(1, size * 0.08);
        this._context.beginPath();
        this._context.moveTo(x, centerY);
        this._context.lineTo(x + size, centerY);
        this._context.stroke();
        break;

      case "forest":
        this._context.fillStyle = "rgba(24, 77, 42, 0.65)";
        this._context.beginPath();
        this._context.arc(centerX, centerY, size * 0.22, 0, Math.PI * 2);
        this._context.fill();
        break;

      case "hill":
        this._context.strokeStyle = "rgba(255, 255, 255, 0.22)";
        this._context.lineWidth = Math.max(1, size * 0.05);
        this._context.beginPath();
        this._context.arc(centerX, centerY + size * 0.12, size * 0.26, Math.PI, 0);
        this._context.stroke();
        break;

      case "mountain":
        this._context.fillStyle = "rgba(245, 247, 250, 0.45)";
        this._context.beginPath();
        this._context.moveTo(centerX, y + size * 0.22);
        this._context.lineTo(x + size * 0.28, y + size * 0.76);
        this._context.lineTo(x + size * 0.72, y + size * 0.76);
        this._context.closePath();
        this._context.fill();
        break;

      case "water":
        this._context.strokeStyle = "rgba(226, 246, 255, 0.38)";
        this._context.lineWidth = Math.max(1, size * 0.05);
        this._context.beginPath();
        this._context.moveTo(x + size * 0.18, y + size * 0.42);
        this._context.quadraticCurveTo(centerX, y + size * 0.25, x + size * 0.82, y + size * 0.42);
        this._context.moveTo(x + size * 0.18, y + size * 0.62);
        this._context.quadraticCurveTo(centerX, y + size * 0.45, x + size * 0.82, y + size * 0.62);
        this._context.stroke();
        break;

      case "grass":
        break;
    }
  }
}
