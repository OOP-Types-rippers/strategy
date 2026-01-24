import { BuildingBase } from "./BuildingBase";
import { IRestoreContext } from "../types/IRestoreContext";
import { IBuildingState } from "../types/IBuilding";

export class Barracks extends BuildingBase {
  trainingQueue: string[] = [];
  trainingSpeed: number = 1;
  
  constructor(position: { x: number; y: number }) {
    super("Barracks", position);
  }
  
  trainUnit(unitType: string): void {
    this.trainingQueue.push(unitType);
    console.log(`Додано ${unitType} в чергу тренування`);
  }
  
  processTraining(): string[] {
    const trained = this.trainingQueue.splice(0, this.trainingSpeed);
    console.log(`Підготовлено юнітів: ${trained.length}`);
    return trained;
  }
  
  getQueueLength(): number {
    return this.trainingQueue.length;
  }
  
  upgradeTrainingSpeed(): void {
    this.trainingSpeed++;
    console.log(`Швидкість тренування збільшена до ${this.trainingSpeed}`);
  }
  
  activate(): void {
    console.log(`Казарми (${this.position.x}, ${this.position.y}) активовані. Черга: ${this.trainingQueue.length}`);
  }
  
  info(): string {
    return `Barracks Lvl.${this.level} at (${this.position.x}, ${this.position.y}) | Queue: ${this.trainingQueue.length}`;
  }
  
  override getUpgradeCost(): number {
    return super.getUpgradeCost() + this.trainingQueue.length * 10;
  }
  
  protected getSpecificData(): Record<string, any> {
    return {
      trainingQueue: this.trainingQueue,
      trainingSpeed: this.trainingSpeed
    };
  }
  
  protected restoreSpecificData(data: Record<string, any>, context: IRestoreContext): void {
    this.trainingQueue = data.trainingQueue || [];
    this.trainingSpeed = data.trainingSpeed || 1;
  }
}
