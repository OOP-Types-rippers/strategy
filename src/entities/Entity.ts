import { IEntity, IEntityState } from "../types/IEntity";
import { IFaction } from "../types/IFaction";
import { IRestoreContext } from "../types/IRestoreContext";

export class Entity implements IEntity {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  movepoints: number;
  canMove: boolean;
  name: string;
  faction: IFaction | null;

  constructor() {
    this.hp = 0;
    this.maxHp = 0;
    this.attack = 0;
    this.defense = 0;
    this.movepoints = 0;
    this.canMove = true;
    this.name = "";
    this.faction = null;
  }

  get Hp(): number {
    return this.hp;
  }

  setHp(newHp: number): void {
    this.hp = newHp;
    if (this.hp > this.maxHp) this.hp = this.maxHp;
    else if (this.hp < 0) this.hp = 0;
    return;
  }

  get MaxHp(): number {
    return this.maxHp;
  }

  setMaxHp(newMaxHp: number): void {
    this.maxHp = newMaxHp;
    if (this.maxHp < 0) this.maxHp = 0;
    return;
  }

  get Attack(): number {
    return this.attack;
  }

  setAttack(newAttack: number): void {
    this.attack = newAttack;
    if (this.attack < 0) this.attack = 0;
    return;
  }

  get Defense(): number {
    return this.defense;
  }

  setDefense(newDefense: number): void {
    this.defense = newDefense;
    if (this.defense < 0) this.defense < 0
    return;
  }

  get MovePoints(): number {
    return this.movepoints;
  }

  setMovePoints(newMovePoints: number): void {
    this.movepoints = newMovePoints;
    if (this.movepoints < 0) this.movepoints = 0;
    return;
  }

  increaseHP(bonus: number): void {
    if (this.hp + bonus >= this.maxHp) this.hp = this.maxHp
    else {
      this.hp += bonus;
      this.hp = Math.floor(this.hp * 10) / 10;    //Rounding down to 1 decimal place
    }
  }

  decreaseHP(bonus: number): void {
    if (this.hp - bonus <= 0) this.hp = 0;
    else {
      this.hp -= bonus;
      this.hp = Math.ceil(this.hp * 10) / 10;    //Rounding up to 1 decimal place
    }
  }

  getState(): IEntityState {
    return {
      hp: this.hp,
      maxHp: this.maxHp,
      defense: this.defense,
      attack: this.attack,
      movepoints: this.movepoints,
      canMove: this.canMove,
      name: this.name,
      faction: this.faction?.name ?? null,
    }
  }

  restoreFromState(entityState: IEntityState, context: IRestoreContext) {
    this.hp = entityState.hp;
    this.maxHp = entityState.maxHp;
    this.defense = entityState.defense;
    this.attack = entityState.attack;
    this.movepoints = entityState.movepoints;
    this.canMove = entityState.canMove;
    this.name = entityState.name;
    this.faction = context.factions.find(f => f.name === entityState.faction) ?? null;
  }
}