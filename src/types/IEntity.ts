import { IFaction } from "./IFaction";

export interface IEntity {
    price: number;
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
    movepoints: number;
    name: string;
    posX: number;
    posY: number;
    hasMoved: boolean;
    faction: IFaction | null;

    get Hp(): number 
    setHp(newHp: number): void 
    get MaxHp(): number 
    setMaxHp(newMaxHp: number): void 
    get Attack(): number 
    setAttack(newAttack: number): void 
    get Defense(): number 
    setDefense(newDefense: number): void
    get MovePoints(): number 
    setMovePoints(newMovePoints: number): void
    get PosX(): number;
    get PosY(): number;
    setPos(newPosX: number, newPosY: number): void
    increaseHP(bonus:number):void
    decreaseHP(bonus:number):void
    
}

