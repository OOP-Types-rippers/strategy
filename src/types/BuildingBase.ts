import { IBuilding, IBuildingState } from "../types/IBuilding";
import { IRestoreContext } from "../types/IRestoreContext";

export abstract class BuildingBase implements IBuilding {
  name: string;
  position: { x: number; y: number };
  level: number;
  isActive: boolean;
  
  constructor(name: string, position: { x: number; y: number }) {
    this.name = name;
    this.position = position;
    this.level = 1;
    this.isActive = true;
  }
  
  abstract activate(): void;
  abstract info(): string;
  
  getState(): IBuildingState {
    return {
      type: this.name,
      x: this.position.x,
      y: this.position.y,
      level: this.level,
      isActive: this.isActive,
      data: {}
    };
  }
  
  restoreFromState(state: IBuildingState, context: IRestoreContext): void {
    this.position = { x: state.x, y: state.y };
    this.level = state.level;
    this.isActive = state.isActive;
  }
  
  getUpgradeCost(): number {
    return this.level * 100;
  }
  
  canUpgrade(): boolean {
    return this.level < 5;
  }
}
