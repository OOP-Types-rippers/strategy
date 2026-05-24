import { IMasterRenderer } from "../../../src/types/IMasterRenderer";
import { IGameState } from "../../../src/types/IGameState";
import { CanvasRenderer } from "./canvas/CanvasRenderer";
import { InfoRenderer } from "./ui/InfoRenderer";
import { StatusRenderer } from "./ui/StatusRenderer";

export class HTMLRenderer implements IMasterRenderer {
  public canvasRenderer: CanvasRenderer;
  private infoRenderer: InfoRenderer;
  private statusRenderer: StatusRenderer;

  constructor() {
    const canvas = document.querySelector<HTMLCanvasElement>("#map");
    if (!canvas) {
      throw new Error("Could not find canvas element with id 'map'");
    }
    const info = document.querySelector<HTMLElement>("#info");
    if (!info) {
      throw new Error("Could not find element with id 'info'");
    }
    const status = document.querySelector<HTMLElement>("#status");
    if (!status) {
      throw new Error("Could not find element with id 'status'");
    }

    this.canvasRenderer = new CanvasRenderer(canvas);
    this.infoRenderer = new InfoRenderer(info);
    this.statusRenderer = new StatusRenderer(status);
  }

  public render(state: IGameState): void {
    this.canvasRenderer.render(state);
    this.infoRenderer.render(state);
    this.statusRenderer.render(state);
  }

  public caption(winner: any | null, turns: number): void {
    // TODO
  }
}