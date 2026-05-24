import type { IGameState } from "../types/IGameState";
import type { IFaction } from "../types/IFaction";
import type { ITile } from "../types/ITile";
import type { IRestoreContext } from "../types/IRestoreContext";
import type { IGameSaver } from "../types/IGameSaver";
import type { InputController } from "../io/InputController";
import type { IMasterRenderer } from "../types/IMasterRenderer";

import { GameMap } from "../map/GameMap";
import { Faction } from "../factions/Faction";

export class GameController {
  public turn: number;
  public currentFaction: IFaction;
  public selectedTile: { x: number, y: number } | null = null;

  private controllers = new Map<IFaction, InputController>();
  private history: IGameState[] = [];

  constructor(
    public map: GameMap,
    public factions: IFaction[],
    private renderer: IMasterRenderer,
    private saver: IGameSaver | null = null
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

    const aliveFactions = new Set<IFaction>();
    this.map.grid.forEach(row => row.forEach(tile => {
      if (tile.unit?.faction) aliveFactions.add(tile.unit.faction);
    }));

    this.factions = this.factions.filter(faction => aliveFactions.has(faction));
    const currentFactionIndex = this.factions.findIndex(faction => faction.name === this.currentFaction.name);
    this.currentFaction = this.factions[(currentFactionIndex + 1) % this.factions.length]!;

    this.turn++;
    this.map.grid.forEach(row => row.forEach(tile => {
      const unit = tile.unit;
      if (unit && unit.faction === this.currentFaction) unit.onTurn();
    }));
    this.render();

    const activeController = this.controllers.get(this.currentFaction);
    if (activeController) await activeController.startTurn();    
  }

  public registerController(faction: Faction, controller: InputController) {
    this.controllers.set(faction, controller);
  }

  private checkWinCondition() {
    let hasUnits = false;
    const aliveFactions = new Set<IFaction>();

    this.map.grid.forEach(row => row.forEach(tile => {
      if (tile.unit) {
        hasUnits = true;
        if (tile.unit.faction) aliveFactions.add(tile.unit.faction);
      }
    }))

    if (!hasUnits) return false;

    if (aliveFactions.size <= 1) {
      this.renderer.caption(aliveFactions.values().next().value ?? null, this.turn);
      return true;
    }

    return false;
  }

  public selectTile(x: number, y: number) {
    if (this.selectedTile?.x === x && this.selectedTile?.y === y) return;
    
    const targetTile = this.map.getTile(x, y);

    if (this.selectedTile) {
      const prevTile = this.map.getTile(this.selectedTile.x, this.selectedTile.y);
      if (prevTile.unit && prevTile.unit.faction === this.currentFaction) {
        const selectedUnit = prevTile.unit;
        const walkDistance = this.map.getDistanceUnitTile(selectedUnit, x, y);
        const attackDistance = Math.abs(selectedUnit.posX - x) + Math.abs(selectedUnit.posY - y);
  
        if (
          targetTile.unit
          && targetTile.unit.faction !== this.currentFaction
          && selectedUnit.canAttack
          && attackDistance === 1
        ) {
          selectedUnit.toAttack(targetTile.unit);
          if (targetTile.unit.hp <= 0) this.map.removeEntity(x, y);
        } else if (!targetTile.unit && walkDistance <= selectedUnit.movepoints && prevTile.unit.canMove) { // replace with actual distance function later
          this.map.moveEntity(selectedUnit, x, y);
        }
      }
    }
    this.selectedTile = { x, y };
    this.render();
  }

  public unselectTile() {
    this.selectedTile = null;
    this.render();
  }

  private render() {
    this.renderer.render(this.getState());
  }

  public getState() {
    const state: IGameState = {
      map: this.map.getState(),
      factions: this.factions,
      currentFaction: this.currentFaction.name,
      selection: this.selectedTile,
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
    this.saver?.save(this.getState(), name);
  }
  public loadGame(name: string) {
    this.history.length = 0;

    const state = this.saver?.load(name);
    if (!state) return;

    this.restoreFromState(state);
  }

  public deleteSave(name: string) {
    this.saver?.delete(name);
  }
}