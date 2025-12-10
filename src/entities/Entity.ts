import { IEntity } from "../types/IEntity";
import { IFaction } from "../types/IFaction";

export class Entity implements IEntity {
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

    constructor() {
        this.price = 0;
        this.hp = 0;
        this.maxHp = 0;
        this.attack = 0;
        this.defense = 0;
        this.movepoints =0;
        this.name = "";
        this.posX = -1;
        this.posY = -1;
        this.hasMoved = false;
        this.faction = null;
    }

    get Hp(): number {
        return this.hp;
    }

    setHp(newHp: number): void {
        this.hp = newHp;
        if(this.hp>this.maxHp) this.hp = this.maxHp;
        else if(this.hp<0) this.hp =0;
        return;
    }

    get MaxHp(): number {
        return this.maxHp;
    }

    setMaxHp(newMaxHp: number): void {
        this.maxHp = newMaxHp;
        if(this.maxHp<0) this.maxHp = 0;
        return;
    }

    get Attack(): number {
        return this.attack;
    }

    get PosX():number{
        return this.posX;
    }

    get PosY():number{
        return this.posY;
    }

    setPos(newPosX: number, newPosY: number): void{
        this.posX = newPosX;
        this.posY = newPosY;
        return;
    }

    setAttack(newAttack: number): void {
        this.attack = newAttack;
        if(this.attack<0) this.attack =0; 
        return;
    }

    get Defense(): number {
        return this.defense;
    }

    setDefense(newDefense: number): void {
        this.defense = newDefense;
        if(this.defense < 0) this.defense <0
        return;
    }

    get MovePoints(): number {
        return this.movepoints;
    }

    setMovePoints(newMovePoints: number): void {
        this.movepoints = newMovePoints;
        if(this.movepoints < 0) this.movepoints = 0;
        return;
    }

    increaseHP(bonus:number):void{
        if(this.hp +bonus >= this.maxHp) this.hp = this.maxHp
        else {
            this.hp += bonus;
            this.hp = Math.floor(this.hp*10)/10;    //Rounding down to 1 decimal place
        }
    }

    decreaseHP(bonus:number):void{
        if(this.hp - bonus <=0) this.hp = 0;
        else{ 
            this.hp -= bonus;
            this.hp = Math.ceil(this.hp*10)/10 ;    //Rounding up to 1 decimal place
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
    name = "Soldier";
}

export class Archer extends Entity {
    price = 250;
    hp = 10.0;
    maxHp = 10.0;
    attack = 5;
    defense = 1.0;
    movepoints = 4;
    name = "Archer";
}

export class Lizard extends Entity {
    price = 300;
    hp = 5.0;
    maxHp = 5.0;
    attack = 5;
    defense = 1.0;
    movepoints = 3;
    name = "Lizard";
}

export class Wizard extends Entity {
    price = 400;
    hp = 10.0;
    maxHp = 10.0;
    attack = 4;
    defense = 1.0;
    movepoints = 4;
    name = "Wizard";
}

export class Knight extends Entity {
    price = 400;
    hp = 10.0;
    maxHp = 10.0;
    attack = 6;
    defense = 2.0;
    movepoints = 4;
    name = "Knight";
}

export class Golem extends Entity {
    price = 600;
    hp = 10.0;
    maxHp = 10.0;
    attack = 6;
    defense = 4.0;
    movepoints = 4;
    name = "Golem";
}