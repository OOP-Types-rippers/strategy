import { InputController } from "../../../src/io/InputController";
import { GameController } from "../../../src/core/GameController";
import { HTMLRenderer } from "../renderers/HTMLRenderer";

export class HTMLInputController extends InputController {
  private canvas: HTMLCanvasElement;
  private renderer: HTMLRenderer;
  private endTurnButton: HTMLButtonElement;
  private boundHandleClick: (event: MouseEvent) => void;
  private boundHandleEndTurnClick: () => void;

  private boundHandleWheel: (event: WheelEvent) => void;

  constructor(gameController: GameController, renderer: HTMLRenderer) {
    super(gameController);
    this.renderer = renderer;
    
    const canvas = document.querySelector<HTMLCanvasElement>("#map");
    if (!canvas) {
      throw new Error("Could not find canvas element with id 'map'");
    }
    this.canvas = canvas;
    
    const endTurnBtn = document.querySelector<HTMLButtonElement>("#end-turn-btn");
    if (!endTurnBtn) {
      throw new Error("Could not find button element with id 'end-turn-btn'");
    }
    this.endTurnButton = endTurnBtn;

    this.boundHandleClick = this.handleClick.bind(this);
    this.boundHandleEndTurnClick = this.handleEndTurnClick.bind(this);
    this.boundHandleWheel = this.handleWheel.bind(this);

    this.canvas.addEventListener("wheel", this.boundHandleWheel, { passive: false });
  }

  private handleWheel(event: WheelEvent) {
    event.preventDefault();

    const camera = this.renderer.canvasRenderer.camera;
    const zoomFactor = 1.5;
    const newZoom = event.deltaY < 0 ? camera.zoom * zoomFactor : camera.zoom / zoomFactor;

    const zoomChanged = camera.setZoom(
      newZoom,
      this.canvas.width,
      this.canvas.height,
      this.gameController.map.width,
      this.gameController.map.height,
      this.renderer.canvasRenderer.tileSize
    );

    if (zoomChanged) {
      this.renderer.render(this.gameController.getState());
    }
  }

  private handleEndTurnClick() {
    this.endTurn();
  }

  private handleClick(event: MouseEvent) {
    if (event.target === this.canvas) {
      const rect = this.canvas.getBoundingClientRect();
      const screenX = event.clientX - rect.left;
      const screenY = event.clientY - rect.top;

      const camera = this.renderer.canvasRenderer.camera;
      const tileSize = this.renderer.canvasRenderer.tileSize;

      const tile = camera.screenToGrid(
        screenX,
        screenY,
        tileSize,
        this.gameController.map.width,
        this.gameController.map.height
      );

      if (tile) {
        console.log(`user clicked on ${tile.x}, ${tile.y}`);
        this.gameController.selectTile(tile.x, tile.y);
      } else {
        console.log(`user clicked outside of canvas or map`);
        this.gameController.unselectTile();
      }
    } else {
      console.log(`user clicked outside of canvas`)
      this.gameController.unselectTile();
    }
  }

  public async startTurn(): Promise<void> {
    console.log(`${this.gameController.currentFaction.name} turn started`);
    document.addEventListener("click", this.boundHandleClick);
    this.endTurnButton.addEventListener("click", this.boundHandleEndTurnClick);
    this.endTurnButton.disabled = false;
  }

  protected endTurn(): void {
    this.endTurnButton.disabled = true;
    this.endTurnButton.removeEventListener("click", this.boundHandleEndTurnClick);
    document.removeEventListener("click", this.boundHandleClick);
    super.endTurn();
  }
}
