import type { IGameState } from "../../../src/types/IGameState";
import type { IRenderer } from "../../../src/types/IRenderer";

export class CanvasRenderer implements IRenderer {
    private canvas: HTMLCanvasElement | null = null;
    private tileSize: number = 50;

    constructor(container: HTMLElement) {
        this.canvas = document.createElement('canvas');
        container.appendChild(this.canvas);
    }

    render(state: IGameState): void {
        if (!this.canvas) return;

        const ctx = this.canvas.getContext('2d');
        if (!ctx) return;

        // Встановлення розмірів canvas
        this.canvas.width = state.map.width * this.tileSize;
        this.canvas.height = state.map.height * this.tileSize;

        // Рендер плиток
        for (let y = 0; y < state.map.height; y++) {
            for (let x = 0; x < state.map.width; x++) {
                const tile = state.map.grid[y]?.[x];
                if (tile) {
                    this.drawTile(ctx, x, y, tile.terrain);

                    // Рендер сутностей та будівель
                    if (tile.unit) {
                        this.drawEntity(ctx, x, y, tile.unit);
                    }
                    if (tile.building) {
                        this.drawBuilding(ctx, x, y, tile.building);
                    }
                }
            }
        }

        // Рендер інформації про гру
        this.renderGameInfo(ctx, state);
    }

    private drawTile(ctx: CanvasRenderingContext2D, x: number, y: number, terrain: string): void {
        const xPos = x * this.tileSize;
        const yPos = y * this.tileSize;

        const colors: Record<string, string> = {
            water: '#4A90E2',
            road: '#8B7355',
            grass: '#7CB342',
            forest: '#33691E',
            mountain: '#78909C',
            hill: '#AED581'
        };

        ctx.fillStyle = colors[terrain] || '#CCCCCC';
        ctx.fillRect(xPos, yPos, this.tileSize, this.tileSize);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.strokeRect(xPos, yPos, this.tileSize, this.tileSize);
    }

    private drawEntity(ctx: CanvasRenderingContext2D, x: number, y: number, entity: any): void {
        const xPos = x * this.tileSize + this.tileSize / 2;
        const yPos = y * this.tileSize + this.tileSize / 2;

        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(xPos, yPos, this.tileSize / 4, 0, Math.PI * 2);
        ctx.fill();
    }

    private drawBuilding(ctx: CanvasRenderingContext2D, x: number, y: number, building: any): void {
        const xPos = x * this.tileSize + 5;
        const yPos = y * this.tileSize + 5;
        const size = this.tileSize - 10;

        ctx.fillStyle = '#FFD700';
        ctx.fillRect(xPos, yPos, size, size);
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.strokeRect(xPos, yPos, size, size);
    }

    private renderGameInfo(ctx: CanvasRenderingContext2D, state: IGameState): void {
        // Рендер інфо вище canvas
        const infoDiv = document.getElementById('game-info');
        if (infoDiv) {
            infoDiv.innerHTML = `
        <div class="game-header">
          <span>Turn: ${state.turn}</span>
          <span>Current Faction: <strong>${state.currentFaction}</strong></span>
          <span>Factions: ${state.factions.map(f => f.name).join(', ')}</span>
        </div>
      `;
        }
    }
}