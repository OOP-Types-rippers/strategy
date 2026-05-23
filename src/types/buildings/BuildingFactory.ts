import { IBuilding } from "../types/IBuilding";
import { Castle } from "./Castle";
import { Village } from "./Village";
import { Barracks } from "./Barracks";

export abstract class BuildingCreator {
  abstract createBuilding(position: { x: number; y: number }): IBuilding;
  
  createAndSetup(position: { x: number; y: number }): IBuilding {
    const building = this.createBuilding(position);
    this.setupBuilding(building);
    return building;
  }
  
  protected setupBuilding(building: IBuilding): void {
    console.log(`Создано здание: ${building.name} на позиции (${building.position.x}, ${building.position.y})`);
  }
}

export class CastleCreator extends BuildingCreator {
  createBuilding(position: { x: number; y: number }): IBuilding {
    return new Castle(position);
  }
  
  protected override setupBuilding(building: IBuilding): void {
    super.setupBuilding(building);
    (building as Castle).upgradeDefense(50); 
  }
}

export class VillageCreator extends BuildingCreator {
  createBuilding(position: { x: number; y: number }): IBuilding {
    return new Village(position);
  }
  
  protected override setupBuilding(building: IBuilding): void {
    super.setupBuilding(building);
    (building as Village).increasePopulation(50); 
  }
}

export class BuildingBuilder {
  private type?: string;
  private position?: { x: number; y: number };
  private level: number = 1;
  private customData: Record<string, any> = {};
  
  setType(type: string): this {
    this.type = type;
    return this;
  }
  
  setPosition(x: number, y: number): this {
    this.position = { x, y };
    return this;
  }
  
  setLevel(level: number): this {
    this.level = level;
    return this;
  }
  
  setCustomData(key: string, value: any): this {
    this.customData[key] = value;
    return this;
  }
  
  build(): IBuilding {
    if (!this.type || !this.position) {
      throw new Error('Type and position are required');
    }
    
    let building: IBuilding;
    
    switch (this.type) {
      case 'Castle':
        building = new Castle(
          this.position, 
          this.customData.defense || 100,
          this.customData.units || ["Knight", "Archer", "Mage"]
        );
        break;
      case 'Village':
        building = new Village(
          this.position,
          this.customData.goldPerTurn || 10,
          this.customData.healPerTurn || 5,
          this.customData.population || 100
        );
        break;
      case 'Barracks':
        building = new Barracks(this.position);
        break;
      default:
        throw new Error(`Unknown building type: ${this.type}`);
    }

    for (let i = 1; i < this.level; i++) {
      building.level++;
    }
    return building;
  }
}
export class SimpleBuildingFactory {
  static createBuilding(type: string, position: { x: number; y: number }): IBuilding {
    switch (type) {
      case 'castle':
      case 'Castle':
        return new Castle(position);
      case 'village':
      case 'Village':
        return new Village(position);
      case 'barracks':
      case 'Barracks':
        return new Barracks(position);
      default:
        throw new Error(`Unknown building type: ${type}`);
    }
  }

  static createFromState(state: any): IBuilding {
    const building = this.createBuilding(state.type, { x: state.x, y: state.y });
    building.level = state.level || 1;
    building.isActive = state.isActive !== false;
    return building;
  }
}
