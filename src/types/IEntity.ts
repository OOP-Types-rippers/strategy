import { IFaction } from "./IFaction";
import { TerrainType } from "./Terrain";
export interface ITerrainSingleStat {
    moveCost: number;
    defenseBonus: number;
}
import { IRestoreContext } from "../types/IRestoreContext";
export type TerrainStats = Record<TerrainType, ITerrainSingleStat>;
export type UnitTerrainStats = Partial<
    Record<TerrainType, Partial<ITerrainSingleStat>>
>;
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
    faction: IFaction | null;
    unitTerrainStats: UnitTerrainStats;
    canMove:boolean;
    canAttack:boolean;
    

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
    toAttack(unit:IEntity):void
    takeDamage(unit:IEntity):void
    restoreFromState(entityState: IEntityState, context: IRestoreContext):void
    getState(): IEntityState 
}

