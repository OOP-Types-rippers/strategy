import { IRestoreContext } from "./IRestoreContext";

export interface IBuildingState {
  type: string;
  x: number;
  y: number;
  level: number;
  isActive: boolean;
  data: Record<string, any>;
}

export interface IBuilding {
  name: string;
  position: { x: number; y: number };
  level: number;
  isActive: boolean;
  activate(): void;
  info(): string;
  getState(): IBuildingState;
  restoreFromState(state: IBuildingState, context: IRestoreContext): void;
  getUpgradeCost(): number;
  canUpgrade(): boolean;
}
