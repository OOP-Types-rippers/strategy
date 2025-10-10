import type { IGameState } from "../types/IGameState";
import type { IRenderer } from "../types/IRenderer";
import type { IGameMap } from "../types/IGameMap";
import type { IFaction } from "../types/IFaction";
import type { IEntity } from "../types/IEntity";

type GameState = "idle" | "selected";

export class GameController {
  public turn: number;
  public currentFaction: IFaction;

  constructor(
    public map: IGameMap,
    public factions: IFaction[],
    private renderer: IRenderer,
  ) {
    this.turn = 1;
    this.currentFaction = factions[0];
  }

  public nextTurn() {
    this.turn++;
    this.currentFaction = this.factions[(this.turn - 1) % this.factions.length];
    // on new turn logic will be placed here
    this.render();
  }

  private render() {
    this.renderer.render(this.getState());
  }

  private getState() {
    const state: IGameState = {
      map: this.map,
      factions: this.factions,
      currentFaction: this.currentFaction,
    }
    return state;
  }
}