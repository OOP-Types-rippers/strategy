import { BuildingManager } from "./BuildingManager";
import { SimpleBuildingFactory } from "./BuildingFactory";
import { BuildingAlgorithms } from "./BuildingAlgorithms";
import { BuildingBase } from "./BuildingBase";

export class GameBuildingSystem {
  private buildingManager: BuildingManager;
  private buildingHistory: string[] = [];
  
  constructor() {
    this.buildingManager = new BuildingManager();
  }
  createBuilding(type: string, x: number, y: number): string {
    try {
      const building = SimpleBuildingFactory.createBuilding(type, { x, y });
      const id = this.buildingManager.addBuilding(building);
      this.buildingHistory.push(`Created ${type} at (${x}, ${y})`);
      return id;
    } catch (error) {
      console.error('Ошибка создания здания:', error);
      throw error;
    }
  }
  upgradeBuilding(id: string): boolean {
    const building = this.buildingManager.getBuilding(id);
    if (!building) return false;
    
    if (building.canUpgrade()) {
      building.level++;
      this.buildingHistory.push(`Upgraded ${building.name} to level ${building.level}`);
      return true;
    }
    
    return false;
  }

  getStatistics() {
    const stats = this.buildingManager.getStatistics();
    const buildings = this.buildingManager.getAllBuildings();
    
    return {
      ...stats,
      totalUpgradeCost: BuildingAlgorithms.calculateTotalUpgradeCost(buildings),
      averageLevel: buildings.reduce((sum, b) => sum + b.level, 0) / buildings.length,
      history: this.buildingHistory.slice(-10)
    };
  }

  exportState(): string {
    const buildings = this.buildingManager.getAllBuildings();
    return BuildingBase.serializeBuildings(buildings);
  }

  importState(json: string, context: any): void {
    const registry = new Map();
    registry.set('Castle', Castle);
    registry.set('Village', Village);
    registry.set('Barracks', Barracks);
    const buildings = BuildingBase.deserializeBuildings(json, context, registry);
    this.buildingManager.clear();
    buildings.forEach(building => {
      this.buildingManager.addBuilding(building);
    });
    
    this.buildingHistory.push('Imported state from save');
  }

  getUpgradeRecommendations(): Array<{id: string, name: string, priority: number}> {
    const buildings = this.buildingManager.getAllBuildings();
    const recommendations = [];
    
    for (const building of buildings) {
      if (building.canUpgrade()) {
        let priority = building.level;
        if (building instanceof BuildingBase) {
          priority *= building.calculateEfficiency();
        }
        recommendations.push({
          id: (building as any).id || 'unknown',
          name: building.name,
          level: building.level,
          priority: Math.round(priority * 100) / 100
        });
      }
    }
    return recommendations.sort((a, b) => b.priority - a.priority);
  }
}
