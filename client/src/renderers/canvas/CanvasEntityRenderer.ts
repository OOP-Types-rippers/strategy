import { IEntityState } from "../../../../src/types/IEntity";
import { IGameState } from "../../../../src/types/IGameState";
import { IRenderer } from "../../../../src/types/IRenderer";
import { UnitSpriteMapper } from "../../../../src/io/UnitSpriteMapper";

export class CanvasEntityRenderer implements IRenderer {
  private imageCache: Map<string, HTMLImageElement> = new Map();
  private _onImageLoad?: () => void;

  constructor(
    private _context: CanvasRenderingContext2D,
    private _tileSize: number,
  ) {}

  public render(state: IGameState): void {
    const { map } = state;

    const factionColors = new Map<string, string>();
    for (const faction of state.factions) {
      const r = (faction.color >> 16) & 255;
      const g = (faction.color >> 8) & 255;
      const b = faction.color & 255;
      factionColors.set(faction.name, `rgb(${r}, ${g}, ${b})`);
    }

    const units: Array<{ entity: IEntityState; x: number; y: number }> = [];

    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const tile = map.grid[y]?.[x];
        if (tile?.unit) {
          units.push({ entity: tile.unit, x, y });
        }
      }
    }

    units.sort((a, b) => a.y - b.y);

    for (const { entity, x, y } of units) {
      this.drawUnit(entity, x, y, factionColors);
      this.drawHealthBar(entity, x, y);

      if (!entity.canMove && !entity.canAttack) {
        this.drawExhaustedMarker(x, y);
      }
    }
  }

  private drawUnit(entity: IEntityState, gridX: number, gridY: number, factionColors: Map<string, string>): void {
    const pxX = gridX * this._tileSize;
    const pxY = gridY * this._tileSize;
    const spritePath = UnitSpriteMapper.getSprite(entity.id);

    if (!this.drawSpriteImage(spritePath, pxX, pxY)) {
      this.drawFallback(entity, pxX, pxY, factionColors);
    }
  }

  private drawSpriteImage(spritePath: string, pxX: number, pxY: number): boolean {
    try {
      let image = this.imageCache.get(spritePath);

      if (!image) {
        image = new Image();
        image.onload = () => this._onImageLoad?.();
        image.src = spritePath;
        this.imageCache.set(spritePath, image);
      }

      if (!image.complete || image.naturalHeight === 0) return false;

      const scale = Math.min(
        this._tileSize / image.naturalWidth,
        this._tileSize / image.naturalHeight,
      ) * 0.9;

      const scaledW = image.naturalWidth * scale;
      const scaledH = image.naturalHeight * scale;
      const offsetX = (this._tileSize - scaledW) / 2;
      const offsetY = (this._tileSize - scaledH) / 2;

      this._context.drawImage(image, pxX + offsetX, pxY + offsetY, scaledW, scaledH);
      return true;
    } catch {
      return false;
    }
  }

  private drawFallback(entity: IEntityState, pxX: number, pxY: number, factionColors: Map<string, string>): void {
    const cx = pxX + this._tileSize / 2;
    const cy = pxY + this._tileSize / 2;
    const r = this._tileSize * 0.35;

    this._context.beginPath();
    this._context.arc(cx, cy, r, 0, Math.PI * 2);
    this._context.fillStyle = factionColors.get(entity.faction ?? "") ?? "#9E9E9E";
    this._context.fill();
    this._context.lineWidth = 2;
    this._context.strokeStyle = "#000000";
    this._context.stroke();

    this._context.fillStyle = "#FFFFFF";
    this._context.font = `bold ${Math.max(16, this._tileSize * 0.35)}px Arial`;
    this._context.textAlign = "center";
    this._context.textBaseline = "middle";
    this._context.fillText(entity.id.charAt(0).toUpperCase(), cx, cy);
  }

  private drawHealthBar(entity: IEntityState, gridX: number, gridY: number): void {
    const pxX = gridX * this._tileSize;
    const pxY = gridY * this._tileSize;

    const text = `${entity.hp}/${entity.maxHp}`;
    const fontSize = Math.max(10, this._tileSize * 0.15);

    this._context.font = `bold ${fontSize}px Arial`;
    this._context.textAlign = "center";
    this._context.textBaseline = "top";

    this._context.fillStyle = "rgba(0, 0, 0, 0.5)";
    this._context.fillText(text, pxX + this._tileSize / 2 + 1, pxY + 3);

    this._context.fillStyle = "#FFFFFF";
    this._context.fillText(text, pxX + this._tileSize / 2, pxY + 2);
  }

  private drawExhaustedMarker(gridX: number, gridY: number): void {
    const cx = gridX * this._tileSize + this._tileSize / 2;
    const cy = gridY * this._tileSize + this._tileSize / 2;

    this._context.beginPath();
    this._context.arc(cx, cy, this._tileSize * 0.4, 0, Math.PI * 2);
    this._context.fillStyle = "rgba(0, 0, 0, 0.4)";
    this._context.fill();
  }

public set tileSize(tileSize: number) {
    this._tileSize = tileSize;
  }

  public set context(context: CanvasRenderingContext2D) {
    this._context = context;
  }

  public set onImageLoad(cb: () => void) {
    this._onImageLoad = cb;
  }
}

