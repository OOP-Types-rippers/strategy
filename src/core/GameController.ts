import type { IGameState } from "../types/IGameState";
import type { IRenderer } from "../types/IRenderer";
import type { IGameMap } from "../types/IGameMap";
import type { IFaction } from "../types/IFaction";
import { ITile } from "../types/ITile";
import { Faction } from "../factions/Faction";
import { IRestoreContext } from "../types/IRestoreContext";
import { IGameSaver } from "../types/IGameSaver";

export class GameController {
  public turn: number;
  public currentFaction: IFaction;
  public selectedTile: ITile | null = null;
  
  private history: IGameState[] = [];

  constructor(
    public map: IGameMap,
    public factions: IFaction[],
    private renderer: IRenderer,
    private saver: IGameSaver
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
    this.selectedTile = tile;
    this.render();
  }

  public unselectTile() {
    this.selectedTile = null;
    this.render();
  }

  private render() {
    this.renderer.render(this.getState());
  }

  private getState() {
    const state: IGameState = {
      map: this.map.getState(),
      factions: this.factions,
      currentFaction: this.currentFaction.name,
      turn: this.turn,
    }
    return state;
  }

  public saveState() {
    const state = this.getState();
    this.history.push(state);
  }

  public prev() {
    if (this.history.length < 2) throw new Error("Cannot restore turn – not enough history entries");

    this.history.pop();
    this.restoreFromState(this.history.at(-1)!);
  }

  public restoreFromState(state: IGameState) {
    const factions = state.factions.map((val) => new Faction(val.name, val.color, val.money));
    const context: IRestoreContext = { factions };


    this.factions = factions;
    this.currentFaction = factions.find(f => f.name === state.currentFaction)!;
    this.turn = state.turn;

    this.history.push(state);

    this.map.restoreFromState(state.map, context);
  }

  public saveGame(name: string) {
    this.saver.save(this.getState(), name);
  }
  public loadGame(name: string) {
    this.history.length = 0;
    
    const state = this.saver.load(name);
    this.restoreFromState(state);
  }
  public deleteSave(name: string) {
    this.saver.delete(name);
  }
}