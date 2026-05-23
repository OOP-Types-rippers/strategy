import { InputController } from "../../../src/io/InputController";
import { GameController } from "../../../src/core/GameController";
import { HTMLRenderer } from "../renderers/HTMLRenderer";

export class HTMLInputController extends InputController {
  private canvas: HTMLCanvasElement;
  private renderer: HTMLRenderer;
  private boundHandleClick: (event: MouseEvent) => void;

  constructor(gameController: GameController, renderer: HTMLRenderer) {
    super(gameController);
    this.renderer = renderer;
    
    const canvas = document.querySelector<HTMLCanvasElement>("#map");
    if (!canvas) {
      throw new Error("Could not find canvas element with id 'map'");
    }
    this.canvas = canvas;
    this.boundHandleClick = this.handleClick.bind(this);
  }

  private handleClick(event: MouseEvent) {
    if (event.target === this.canvas) {
      const rect = this.canvas.getBoundingClientRect();
      const screenX = event.clientX - rect.left;
      const screenY = event.clientY - rect.top;

      const camera = this.renderer.canvasRenderer.camera;
      const tileSize = this.renderer.canvasRenderer.tileSize;

      const tile = camera.screenToGrid(screenX, screenY, tileSize);

      console.log(`user clicked on ${tile.x}, ${tile.y}`)
      this.gameController.selectTile(tile.x, tile.y);
    } else {
      console.log(`user clicked outside of canvas`)
      this.gameController.unselectTile();
    }
  }

  public async startTurn(): Promise<void> {
    document.addEventListener("click", this.boundHandleClick);
  }

  protected endTurn(): void {
    document.removeEventListener("click", this.boundHandleClick);
    super.endTurn();
  }
}
