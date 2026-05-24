import { IEntity, IEntityState, ITerrainSingleStat, UnitTerrainStats } from "../types/IEntity";

import { IFaction } from "../types/IFaction";
import { IRestoreContext } from "../types/IRestoreContext";

export class Entity implements IEntity {
  price: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  movepoints: number;
  id: string;
  posX: number;
  posY: number;
  hasMoved: boolean;
  faction: IFaction | null;
  unitTerrainStats: UnitTerrainStats;
  canAttack: boolean;

  constructor() {
    this.price = 0;
    this.hp = 0;
    this.maxHp = 0;
    this.attack = 0;
    this.defense = 0;
    this.movepoints = 0;
    this.id = "";
    this.posX = -1;
    this.posY = -1;
    this.hasMoved = false;
    this.canAttack = true;
    this.faction = null;
    this.unitTerrainStats = {}; // за замовчуванням юніт нічого не змінює
  }

  get canMove() {
    return !this.hasMoved;
  }

  set canMove(can: boolean) {
    this.hasMoved = !can;
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

  get PosX() {
    return this.posX;
  }
  get PosY() {
    return this.posY;
  }

  setPos(newPosX: number, newPosY: number): void {
    this.posX = newPosX;
    this.posY = newPosY;
    return;
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

  takeDamage(unit: IEntity, tileDefenseBonus: number = 0) {
    const effectiveDefense = this.Defense + tileDefenseBonus;
    const baseDamage = Math.max(0, unit.Attack * (10 - effectiveDefense) / 10) * (unit.Hp / unit.MaxHp);
    const damage = Math.max(0.1, baseDamage * unit.Hp / unit.MaxHp);
    this.decreaseHP(damage);
  }

  toAttack(unit: IEntity, tileDefenseBonus: number = 0) {
    unit.takeDamage(this, tileDefenseBonus);
    this.canAttack = false;
    this.hasMoved = true;
  }

  onTurn() {
    this.hasMoved = false
    this.canAttack = true
  }

  get UTS(): UnitTerrainStats {
    return this.unitTerrainStats;
  }
  restoreFromState(entityState: IEntityState, context: IRestoreContext) {
    this.id = entityState.id;
    this.price = entityState.price;
    this.hp = entityState.hp;
    this.maxHp = entityState.maxHp;
    this.defense = entityState.defense;
    this.attack = entityState.attack;
    this.movepoints = entityState.movepoints;
    this.canMove = entityState.canMove;
    this.canAttack = entityState.canAttack;
    this.faction = context.factions.find(f => f.name === entityState.faction) ?? null;
    this.unitTerrainStats = entityState.unitTerrainStats
  }
  getState(): IEntityState {
    return {
      id: this.id,
      price: this.price,
      hp: this.hp,
      maxHp: this.maxHp,
      defense: this.defense,
      attack: this.attack,
      movepoints: this.movepoints,
      canMove: this.canMove,
      canAttack: this.canAttack,
      faction: this.faction?.name ?? null,
      unitTerrainStats: this.unitTerrainStats,
    }
  }

}

export class Soldier extends Entity {
  price = 150;
  hp = 10.0;
  maxHp = 10.0;
  attack = 5;
  defense = 1.0;
  movepoints = 4;
  id = "soldier";
}

export class Archer extends Entity {
  price = 250;
  hp = 10.0;
  maxHp = 10.0;
  attack = 5;
  defense = 1.0;
  movepoints = 4;
  id = "archer";
}

export class Lizard extends Entity {
  price = 300;
  hp = 5.0;
  maxHp = 5.0;
  attack = 5;
  defense = 1.0;
  movepoints = 3;
  id = "lizard";
  unitTerrainStats = { water: { moveCost: 0.5, defenseBonus: 2 } };
}

export class Wizard extends Entity {
  price = 400;
  hp = 10.0;
  maxHp = 10.0;
  attack = 4;
  defense = 1.0;
  movepoints = 4;
  id = "wizard";
}

export class Knight extends Entity {
  price = 400;
  hp = 10.0;
  maxHp = 10.0;
  attack = 6;
  defense = 2.0;
  movepoints = 4;
  id = "knight";
}

export class Golem extends Entity {
  price = 600;
  hp = 10.0;
  maxHp = 10.0;
  attack = 6;
  defense = 4.0;
  movepoints = 4;
  id = "golem";
}