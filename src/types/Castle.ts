import { BuildingBase } from "./BuildingBase";
import { IRestoreContext } from "../types/IRestoreContext";
import { IBuildingState } from "../types/IBuilding";

export class Castle extends BuildingBase {
  defense: number;
  availableUnits: string[];
  
  constructor(
    position: { x: number; y: number },
    defense: number = 100,
    availableUnits: string[] = ["Knight", "Archer", "Mage"]
  ) {
    super("Castle", position);
    this.defense = defense;
    this.availableUnits = availableUnits;
  }
  
  hire(unit: string): string {
    if (this.availableUnits.includes(unit)) {
      return `Найнято ${unit} в замку (${this.position.x}, ${this.position.y})`;
    }
    return `${unit} недоступно в цьому замку.`;
  }
  
  upgradeDefense(amount: number): void {
    this.defense += amount;
  }
  
  activate(): void {
    console.log(`Замок (${this.position.x}, ${this.position.y}) активовано. Захист: ${this.defense}`);
  }
  
  info(): string {
    return `Castle Lvl.${this.level} at (${this.position.x}, ${this.position.y}) | Defense: ${this.defense}`;
  }
  
  override getState(): IBuildingState {
    const state = super.getState();
    state.data = {
      defense: this.defense,
      availableUnits: this.availableUnits
    };
    return state;
  }
  
  override restoreFromState(state: IBuildingState, context: IRestoreContext): void {
    super.restoreFromState(state, context);
    this.defense = state.data.defense || 100;
    this.availableUnits = state.data.availableUnits || ["Knight", "Archer", "Mage"];
  }
  
  override getUpgradeCost(): number {
    return super.getUpgradeCost() + this.defense * 0.5;
  }
}
