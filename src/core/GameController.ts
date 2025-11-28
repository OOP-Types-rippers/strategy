import type { IGameState } from "../types/IGameState";
import type { IRenderer } from "../types/IRenderer";
import type { IGameMap } from "../types/IGameMap";
import type { IFaction } from "../types/IFaction";
import { ITile } from "../types/ITile";

export class GameController {
  public turn: number;
  public currentFaction: IFaction;
  public selectedTile: ITile | null = null;

  constructor(
    public map: IGameMap,
    public factions: IFaction[],
    private renderer: IRenderer,
  ) {
    this.turn = 1;
    this.currentFaction = factions[0]!;
  }

  public nextTurn() {
    this.turn++;
    this.currentFaction = this.factions[(this.turn - 1) % this.factions.length]!;
    // on new turn logic will be placed here
    this.render();
  }

  public selectTile(x: number, y: number) {
    const tile = this.map.getTile(x, y)
    if (this.selectedTile && this.selectedTile.unit) {
      // move entity and unselect
    }
    this.selectedTile = tile
    this.render()
  }

  public unselectTile() {
    this.selectedTile = null
    this.render()
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