import type { IGameState } from "../../../src/types/IGameState";
import type { IEntityState } from "../../../src/types/IEntity";
import type { IBuildingState } from "../../../src/types/IBuilding";

export class MapRenderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private tileSize: number = 50;
    private padding: number = 40;
    private hoveredTile: { x: number; y: number } | null = null;
    private selectedTile: { x: number; y: number } | null = null;

    private terrainColors: Record<string, string> = {
        water: '#1E88E5',
        road: '#A1887F',
        grass: '#7CB342',
        forest: '#2E7D32',
        hill: '#FDD835',
        mountain: '#90A4AE'
    };

    private terrainShadows: Record<string, string> = {
        water: '#0D47A1',
        road: '#6D4C41',
        grass: '#558B2F',
        forest: '#1B5E20',
        hill: '#F57F17',
        mountain: '#455A64'
    };

    constructor(container: HTMLElement) {
        this.canvas = document.createElement('canvas');
        this.canvas.style.border = '2px solid #666';
        this.canvas.style.backgroundColor = '#0a0a0a';
        this.canvas.style.cursor = 'crosshair';
        container.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d')!;
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.onCanvasClick(e));
        this.canvas.addEventListener('mouseleave', () => {
            this.hoveredTile = null;
        });
    }

    private onMouseMove(e: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - this.padding;
        const y = e.clientY - rect.top - this.padding;

        const tileX = Math.floor(x / this.tileSize);
        const tileY = Math.floor(y / this.tileSize);

        this.hoveredTile = { x: tileX, y: tileY };
    }

    private onCanvasClick(e: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - this.padding;
        const y = e.clientY - rect.top - this.padding;

        const tileX = Math.floor(x / this.tileSize);
        const tileY = Math.floor(y / this.tileSize);

        this.selectedTile = { x: tileX, y: tileY };

        this.canvas.dispatchEvent(
            new CustomEvent('tileSelected', { detail: { x: tileX, y: tileY } })
        );
    }

    render(state: IGameState): void {
        const mapState = state.map;
        const width = mapState.width;
        const height = mapState.height;

        this.canvas.width = width * this.tileSize + this.padding * 2;
        this.canvas.height = height * this.tileSize + this.padding * 2;

        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.translate(this.padding, this.padding);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const tile = mapState.grid[y]?.[x];
                if (tile) {
                    this.drawTile(x, y, tile.terrain);

                    if (tile.building) {
                        this.drawBuilding(x, y, tile.building);
                    }

                    if (tile.unit) {
                        this.drawUnit(x, y, tile.unit);
                    }
                }
            }
        }

        if (this.hoveredTile && this.isValidTile(this.hoveredTile.x, this.hoveredTile.y, width, height)) {
            this.drawHover(this.hoveredTile.x, this.hoveredTile.y);
        }

        if (this.selectedTile && this.isValidTile(this.selectedTile.x, this.selectedTile.y, width, height)) {
            this.drawSelection(this.selectedTile.x, this.selectedTile.y);
        }

        this.ctx.restore();

        this.drawInfo(state);
    }

    private drawTile(x: number, y: number, terrain: string): void {
        const xPos = x * this.tileSize;
        const yPos = y * this.tileSize;

        this.ctx.fillStyle = this.terrainColors[terrain] || '#999';
        this.ctx.fillRect(xPos, yPos, this.tileSize, this.tileSize);

        this.ctx.fillStyle = this.terrainShadows[terrain] || '#666';
        this.ctx.fillRect(xPos, yPos + this.tileSize - 5, this.tileSize, 5);

        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(xPos, yPos, this.tileSize, this.tileSize);

        this.drawTerrainTexture(xPos, yPos, terrain);
    }

    private drawTerrainTexture(x: number, y: number, terrain: string): void {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';

        switch (terrain) {
            case 'forest':
                for (let i = 0; i < 3; i++) {
                    const px = x + 10 + i * 15;
                    const py = y + 15;
                    this.ctx.beginPath();
                    this.ctx.arc(px, py, 3, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                break;
            case 'mountain':
                this.ctx.beginPath();
                this.ctx.moveTo(x + this.tileSize / 2, y + 10);
                this.ctx.lineTo(x + 10, y + this.tileSize - 10);
                this.ctx.lineTo(x + this.tileSize - 10, y + this.tileSize - 10);
                this.ctx.closePath();
                this.ctx.fill();
                break;
            case 'water':
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                this.ctx.lineWidth = 1;
                for (let i = 0; i < 2; i++) {
                    this.ctx.beginPath();
                    this.ctx.arc(x + 15, y + 15 + i * 15, 5, 0, Math.PI * 2);
                    this.ctx.stroke();
                }
                break;
        }
    }

    private drawUnit(x: number, y: number, unit: IEntityState): void {
        const xPos = x * this.tileSize + this.tileSize / 2;
        const yPos = y * this.tileSize + this.tileSize / 2;

        const factionColor = unit.faction || '#FF6B6B';

        this.ctx.fillStyle = factionColor;
        this.ctx.beginPath();
        this.ctx.arc(xPos, yPos, this.tileSize / 3, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = '#FFF';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.drawHealthBar(x, y, unit.hp, unit.maxHp);

        this.ctx.fillStyle = '#FFF';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(`${unit.hp}/${unit.maxHp}`, xPos, yPos);
    }

    private drawHealthBar(x: number, y: number, hp: number, maxHp: number): void {
        const xPos = x * this.tileSize + 5;
        const yPos = y * this.tileSize + 5;
        const barWidth = this.tileSize - 10;
        const barHeight = 4;

        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(xPos, yPos, barWidth, barHeight);

        const healthPercent = hp / maxHp;
        const color = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FFC107' : '#F44336';
        this.ctx.fillStyle = color;
        this.ctx.fillRect(xPos, yPos, barWidth * healthPercent, barHeight);

        this.ctx.strokeStyle = '#FFF';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(xPos, yPos, barWidth, barHeight);
    }

    private drawBuilding(x: number, y: number, building: IBuildingState): void {
        const xPos = x * this.tileSize + 8;
        const yPos = y * this.tileSize + 8;
        const size = this.tileSize - 16;

        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(xPos, yPos, size, size);

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(xPos + 2, yPos + size - 5, size, 5);

        this.ctx.strokeStyle = '#FFA500';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(xPos, yPos, size, size);

        this.ctx.fillStyle = '#FF6B00';
        this.ctx.beginPath();
        this.ctx.moveTo(xPos + size / 2, yPos - 5);
        this.ctx.lineTo(xPos - 2, yPos + 8);
        this.ctx.lineTo(xPos + size + 2, yPos + 8);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = '#FFF';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(building.level.toString(), xPos + size / 2, yPos + size / 2);
    }

    private drawHover(x: number, y: number): void {
        const xPos = x * this.tileSize;
        const yPos = y * this.tileSize;

        this.ctx.strokeStyle = '#00FF00';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(xPos, yPos, this.tileSize, this.tileSize);

        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        this.ctx.fillRect(xPos, yPos, this.tileSize, this.tileSize);
    }

    private drawSelection(x: number, y: number): void {
        const xPos = x * this.tileSize;
        const yPos = y * this.tileSize;

        this.ctx.strokeStyle = '#FF00FF';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(xPos, yPos, this.tileSize, this.tileSize);

        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeStyle = '#00FFFF';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(xPos + 2, yPos + 2, this.tileSize - 4, this.tileSize - 4);
        this.ctx.setLineDash([]);
    }

    private drawInfo(state: IGameState): void {
        const padding = 10;
        const lineHeight = 20;
        let yOffset = padding;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, lineHeight * 4 + padding * 2);

        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';

        this.ctx.fillText(`Turn: ${state.turn}`, padding, yOffset);
        yOffset += lineHeight;

        this.ctx.fillText(`Faction: ${state.currentFaction}`, padding, yOffset);
        yOffset += lineHeight;

        this.ctx.fillText(`Map: ${state.map.width}x${state.map.height}`, padding, yOffset);
        yOffset += lineHeight;

        const hoveredInfo = this.hoveredTile ? `(${this.hoveredTile.x}, ${this.hoveredTile.y})` : '';
        this.ctx.fillText(`Hovered: ${hoveredInfo}`, padding, yOffset);
        yOffset += lineHeight;

        const selectedInfo = this.selectedTile ? `(${this.selectedTile.x}, ${this.selectedTile.y})` : '';
        this.ctx.fillText(`Selected: ${selectedInfo}`, padding, yOffset);
    }

    private isValidTile(x: number, y: number, mapWidth: number, mapHeight: number): boolean {
        return x >= 0 && x < mapWidth && y >= 0 && y < mapHeight;
    }
}