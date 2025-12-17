import { IFaction } from "./IFaction";
import { IRestoreContext } from "./IRestoreContext";

export interface IEntityState {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  movepoints: number;
  canMove: boolean;
  name: string;
  faction: string | null;
}

export interface IEntity {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  movepoints: number;
  name: string;
  faction: IFaction | null;
  canMove: boolean;

  get Hp(): number;
  setHp(newHp: number): void;
  get MaxHp(): number;
  setMaxHp(newMaxHp: number): void;
  get Attack(): number;
  setAttack(newAttack: number): void;
  get Defense(): number;
  setDefense(newDefense: number): void;
  get MovePoints(): number;
  setMovePoints(newMovePoints: number): void;

  increaseHP(bonus: number): void
  decreaseHP(bonus: number): void

  getState(): IEntityState;
  restoreFromState(state: IEntityState, context: IRestoreContext): void;
}

