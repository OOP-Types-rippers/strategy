import type { GameController } from "../../../src/core/GameController";
import { MapRenderer } from "../renderers/MapRenderer";

export class GameMapPage {
    private gameController: GameController;
    private renderer: MapRenderer | null = null;
    private container: HTMLElement | null = null;
    private animationId: number | null = null;

    constructor(gameController: GameController) {
        this.gameController = gameController;
    }

    render(container: HTMLElement): void {
        this.container = container;
        container.innerHTML = `
      <div class="game-page">
        <div id="game-info"></div>
        <div id="map-container" style="width: 100%; overflow: auto; max-height: 600px;"></div>
        <div class="game-controls">
          <button id="next-turn-btn">Next Turn</button>
          <button id="build-btn">Build Structure</button>
          <button id="save-btn">Save Game</button>
          <button id="menu-btn">Back to Menu</button>
        </div>
      </div>
    `;

        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
            this.setupRenderer(mapContainer);
        }

        this.setupEventListeners();

        // Перший рендер
        this.gameController.map.buildMap();
        this.gameController.map.getSeed();
        this.updateRender();

        // Реальний рендер цикл
        this.startRenderLoop();
    }

    private setupRenderer(mapContainer: HTMLElement): void {
        this.renderer = new MapRenderer(mapContainer);

        // Замінити renderer в GameController
        (this.gameController as any).renderer = this.renderer;

        // Слухати events від canvas
        const canvas = mapContainer.querySelector('canvas');
        if (canvas) {
            canvas.addEventListener('tileSelected', (e: Event) => {
                const { x, y } = (e as CustomEvent).detail;
                this.onTileSelected(x, y);
            });
        }
    }

    private setupEventListeners(): void {
        document.getElementById('next-turn-btn')?.addEventListener('click', () => {
            this.gameController.nextTurn();
            this.updateRender();
        });

        document.getElementById('build-btn')?.addEventListener('click', () => {
            alert('Building not implemented yet');
        });

        document.getElementById('save-btn')?.addEventListener('click', () => {
            const name = prompt('Enter save name:');
            if (name) {
                this.gameController.saveGame(name);
                alert('Game saved!');
            }
        });

        document.getElementById('menu-btn')?.addEventListener('click', () => {
            window.location.href = '#/';
            this.cleanup();
        });
    }

    private onTileSelected(x: number, y: number): void {
        try {
            this.gameController.selectTile(x, y);
            this.updateRender();
        } catch (err) {
            console.error('Invalid tile selection:', err);
        }
    }

    private updateRender(): void {
        if (!this.renderer) return;

        const state = {
            map: this.gameController.map.getState(),
            factions: this.gameController.factions,
            currentFaction: this.gameController.currentFaction.name,
            turn: this.gameController.turn,
        };

        this.renderer.render(state);
    }

    private startRenderLoop(): void {
        const update = () => {
            // Для мислення можна додати анімації тут
            this.animationId = requestAnimationFrame(update);
        };
        update();
    }

    private cleanup(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    destroy(): void {
        this.cleanup();
    }
}