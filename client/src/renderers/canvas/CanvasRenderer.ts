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
    private _tileSize = 32;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const ctx = this.canvas.getContext("2d");
        if (!ctx) throw new Error("Не вдалося ініціалізувати 2D контекст Canvas");

        this.context = ctx;

        this.terrainRenderer = new CanvasTerrainRenderer(this.context, this._tileSize);
        this.entityRenderer = new CanvasEntityRenderer(this.context, this._tileSize);
        this.highlightRenderer = new CanvasHighlightRenderer(this.context, this._tileSize);

        this._camera = new Camera();
    }

    public render(state: IGameState): void {
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
