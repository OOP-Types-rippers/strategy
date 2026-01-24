import { IBuilding, IBuildingState } from "../types/IBuilding";
import { IRestoreContext } from "../types/IRestoreContext";

export abstract class BuildingBase implements IBuilding {
  name: string;
  position: { x: number; y: number };
  level: number;
  isActive: boolean;
  createdAt: Date;
  
  constructor(name: string, position: { x: number; y: number }) {
    this.name = name;
    this.position = position;
    this.level = 1;
    this.isActive = true;
    this.createdAt = new Date();
  }
  
  abstract activate(): void;
  abstract info(): string;
  abstract getUpgradeCost(): number;
  
  canUpgrade(): boolean {
    return this.level < 5;
  }
  
  upgrade(): boolean {
    if (this.canUpgrade()) {
      this.level++;
      return true;
    }
    return false;
  }
  
  calculateEfficiency(): number {
    const ageInDays = (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return this.level / (ageInDays + 1); 
  }

  compareTo(other: IBuilding): number {
    if (this.level !== other.level) {
      return other.level - this.level; 
    }
    
    if (other instanceof BuildingBase) {
      return other.calculateEfficiency() - this.calculateEfficiency();
    }
    
    return 0;
  }

  getState(): IBuildingState {
    return {
      type: this.name,
      x: this.position.x,
      y: this.position.y,
      level: this.level,
      isActive: this.isActive,
      data: {
        createdAt: this.createdAt.toISOString(),
        ...this.getSpecificData()
      }
    };
  }

  restoreFromState(state: IBuildingState, context: IRestoreContext): void {
    this.position = { x: state.x, y: state.y };
    this.level = state.level;
    this.isActive = state.isActive;
    this.createdAt = new Date(state.data.createdAt || Date.now());
    this.restoreSpecificData(state.data, context);
  }
  
  protected abstract getSpecificData(): Record<string, any>;
  protected abstract restoreSpecificData(data: Record<string, any>, context: IRestoreContext): void;

  static serializeBuildings(buildings: IBuilding[]): string {
    const states = buildings.map(b => b.getState());
    return JSON.stringify(states, null, 2);
  }
  
  static deserializeBuildings(
    json: string, 
    context: IRestoreContext,
    buildingRegistry: Map<string, new (pos: {x: number, y: number}) => IBuilding>
  ): IBuilding[] {
    const states: IBuildingState[] = JSON.parse(json);
    const buildings: IBuilding[] = [];
    
    for (const state of states) {
      const Constructor = buildingRegistry.get(state.type);
      if (Constructor) {
        const building = new Constructor({ x: state.x, y: state.y });
        building.restoreFromState(state, context);
        buildings.push(building);
      }
    }
    
    return buildings;
  }
}
