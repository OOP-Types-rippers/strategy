import { Camera } from "./Camera";
import { IGameState } from "../../../../src/types/IGameState";
import { IRenderer } from "../../../../src/types/IRenderer";
import { CanvasTerrainRenderer } from "./CanvasTerrainRenderer";
import { CanvasEntityRenderer } from "./CanvasEntityRenderer";
import { CanvasHighlightRenderer } from "./CanvasHighlightRenderer";

export class CanvasRenderer implements IRenderer {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    
    private terrainRenderer: CanvasTerrainRenderer;
    private entityRenderer: CanvasEntityRenderer;
    private highlightRenderer: CanvasHighlightRenderer;
    
    private _camera: Camera;
    private _tileSize = 128;
    private lastState?: IGameState;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const ctx = this.canvas.getContext("2d");
        if (!ctx) throw new Error("Не вдалося ініціалізувати 2D контекст Canvas");

        this.context = ctx;

        this.resize();
        window.addEventListener("resize", () => this.resize());

        this.terrainRenderer = new CanvasTerrainRenderer(this.context, this._tileSize);
        this.entityRenderer = new CanvasEntityRenderer(this.context, this._tileSize);
        this.highlightRenderer = new CanvasHighlightRenderer(this.context, this._tileSize);

        this._camera = new Camera();
    }

    private resize(): void {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.context.scale(dpr, dpr);
        
        if (this.lastState) {
            this.render(this.lastState);
        }
    }

    public render(state: IGameState): void {
        this.lastState = state;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.save();

        this.camera.applyTransformations(this.context);
        this.terrainRenderer.render(state);
        this.highlightRenderer.render(state);
        this.entityRenderer.render(state);

        this.context.restore();
    }


    public caption(faction: any, turn: number): void {
        // TODO
    }

    public get camera(): Camera {
        return this._camera;
    }

    public get tileSize(): number {
        return this._tileSize;
    }

    public set tileSize(size: number) {
        this._tileSize = size;
        this.terrainRenderer.tileSize = size;
        this.entityRenderer.tileSize = size;
        this.highlightRenderer.tileSize = size;
    }
}
