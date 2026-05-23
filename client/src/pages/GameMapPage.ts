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

        const gamePage = document.createElement('div');
        gamePage.className = 'game-page';

        const gameInfo = document.createElement('div');
        gameInfo.id = 'game-info';
        gamePage.appendChild(gameInfo);

        const mapContainer = document.createElement('div');
        mapContainer.id = 'map-container';
        mapContainer.style.width = '100%';
        mapContainer.style.overflow = 'auto';
        mapContainer.style.maxHeight = '600px';
        gamePage.appendChild(mapContainer);

        const gameControls = document.createElement('div');
        gameControls.className = 'game-controls';

        const nextTurnBtn = document.createElement('button');
        nextTurnBtn.id = 'next-turn-btn';
        nextTurnBtn.textContent = 'Next Turn';
        gameControls.appendChild(nextTurnBtn);

        const buildBtn = document.createElement('button');
        buildBtn.id = 'build-btn';
        buildBtn.textContent = 'Build Structure';
        gameControls.appendChild(buildBtn);

        const saveBtn = document.createElement('button');
        saveBtn.id = 'save-btn';
        saveBtn.textContent = 'Save Game';
        gameControls.appendChild(saveBtn);

        const menuBtn = document.createElement('button');
        menuBtn.id = 'menu-btn';
        menuBtn.textContent = 'Back to Menu';
        gameControls.appendChild(menuBtn);

        gamePage.appendChild(gameControls);
        container.appendChild(gamePage);

        this.setupRenderer(mapContainer);
        this.setupEventListeners();

        this.gameController.map.buildMap();
        this.gameController.map.getSeed();
        this.updateRender();

        this.startRenderLoop();
    }

    private setupRenderer(mapContainer: HTMLElement): void {
        this.renderer = new MapRenderer(mapContainer);

        (this.gameController as any).renderer = this.renderer;

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