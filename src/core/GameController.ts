import type { IGameState } from "../types/IGameState";
import type { IRenderer } from "../types/IRenderer";
import type { IFaction } from "../types/IFaction";
import { ITile } from "../types/ITile";
import { Faction } from "../factions/Faction";
import { IRestoreContext } from "../types/IRestoreContext";
import { IGameSaver } from "../types/IGameSaver";
import { InputController } from "../io/InputController";
import { GameMap } from "../map/GameMap";

export class GameController {
  public turn: number;
  public currentFaction: IFaction;
  public selectedTile: ITile | null = null;

  private controllers = new Map<IFaction, InputController>();
  private history: IGameState[] = [];

  constructor(
    public map: GameMap,
    public factions: IFaction[],
    private renderer: IRenderer,
    private saver: IGameSaver
  ) {
    this.turn = 1;
    this.currentFaction = factions[0]!;
  }

  public async start() {
    this.render();

    const activeController = this.controllers.get(this.currentFaction);
    if (activeController) await activeController.startTurn();    
  }

  public async nextTurn() {
    if (this.checkWinCondition()) return;

    this.turn++;
    this.currentFaction = this.factions[(this.turn - 1) % this.factions.length]!;

    this.map.grid.forEach(row => row.forEach(tile => tile.unit?.onTurn()));
    this.render();

    const activeController = this.controllers.get(this.currentFaction);
    if (activeController) await activeController.startTurn();    
  }

  public registerController(faction: Faction, controller: InputController) {
    this.controllers.set(faction, controller);
  }

  private checkWinCondition() {
    const aliveFactions = new Set<IFaction>();

    this.map.grid.forEach(row => row.forEach(tile => {
      if (tile.unit?.faction) aliveFactions.add(tile.unit.faction);
    }))

    if (aliveFactions.size <= 1) {
      this.renderer.caption(aliveFactions.values().next().value ?? null, this.turn);
      return true;
    }

    return false;
  }

  public selectTile(x: number, y: number) {
    const targetTile = this.map.getTile(x, y);
    if (targetTile === this.selectedTile) return

    if (this.selectedTile?.unit && this.selectedTile.unit.faction === this.currentFaction) {
      const selectedUnit = this.selectedTile.unit;
      const distance = Math.abs(selectedUnit.posX - x) + Math.abs(selectedUnit.posY - y);

      if (
        targetTile.unit
        && targetTile.unit.faction !== this.currentFaction
        && selectedUnit.canAttack
        && distance === 1
      ) {
        selectedUnit.toAttack(targetTile.unit);
        if (targetTile.unit.hp <= 0) this.map.removeEntity(x, y);
      } else if (!targetTile.unit && distance <= selectedUnit.movepoints) { // replace with actual distance function later
        this.map.moveEntity(selectedUnit, x, y);
      }
    }
    this.selectedTile = targetTile;
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