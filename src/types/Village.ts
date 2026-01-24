import { BuildingBase } from "./BuildingBase";
import { IRestoreContext } from "../types/IRestoreContext";
import { IBuildingState } from "../types/IBuilding";

export class Village extends BuildingBase {
  goldPerTurn: number;
  healPerTurn: number;
  population: number;
  
  constructor(
    position: { x: number; y: number },
    goldPerTurn: number = 10,
    healPerTurn: number = 5,
    population: number = 100
  ) {
    super("Village", position);
    this.goldPerTurn = goldPerTurn;
    this.healPerTurn = healPerTurn;
    this.population = population;
  }
  
  collectGold(): number {
    return this.goldPerTurn;
  }
  
  increasePopulation(amount: number): void {
    this.population += amount;
  }
  
  activate(): void {
    console.log(`Деревня (${this.position.x}, ${this.position.y}) активована. Населення: ${this.population}`);
  }
  
  info(): string {
    return `Village Lvl.${this.level} at (${this.position.x}, ${this.position.y}) | Золото: ${this.goldPerTurn}/turn`;
  }
  
  override getState(): IBuildingState {
    const state = super.getState();
    state.data = {
      goldPerTurn: this.goldPerTurn,
      healPerTurn: this.healPerTurn,
      population: this.population
    };
    return state;
  }
  
  override restoreFromState(state: IBuildingState, context: IRestoreContext): void {
    super.restoreFromState(state, context);
    this.goldPerTurn = state.data.goldPerTurn || 10;
    this.healPerTurn = state.data.healPerTurn || 5;
    this.population = state.data.population || 100;
  }
  
  override getUpgradeCost(): number {
    return super.getUpgradeCost() + this.population * 0.1;
  }
}
