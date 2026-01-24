import { IBuilding } from "../types/IBuilding";
import { BuildingBase } from "./BuildingBase";

export class BuildingAlgorithms {
  static sortByLevel(buildings: IBuilding[]): IBuilding[] {
    return [...buildings].sort((a, b) => b.level - a.level);
  }
 
  static sortByEfficiency(buildings: IBuilding[]): IBuilding[] {
    return [...buildings].sort((a, b) => {
      if (a instanceof BuildingBase && b instanceof BuildingBase) {
        return b.calculateEfficiency() - a.calculateEfficiency();
      }
      return 0;
    });
  }

  static filterByTypeAndLevel(
    buildings: IBuilding[], 
    type: string, 
    minLevel: number = 1
  ): IBuilding[] {
    return buildings.filter(b => 
      b.name === type && b.level >= minLevel
    );
  }
  
  static findNearestBuilding(
    buildings: IBuilding[], 
    x: number, 
    y: number
  ): IBuilding | null {
    if (buildings.length === 0) return null;
    
    return buildings.reduce((nearest, current) => {
      const nearestDist = Math.sqrt(
        Math.pow(nearest.position.x - x, 2) + 
        Math.pow(nearest.position.y - y, 2)
      );
      const currentDist = Math.sqrt(
        Math.pow(current.position.x - x, 2) + 
        Math.pow(current.position.y - y, 2)
      );
      
      return currentDist < nearestDist ? current : nearest;
    });
  }
  
  static groupByType(buildings: IBuilding[]): Map<string, IBuilding[]> {
    const groups = new Map<string, IBuilding[]>();
    
    for (const building of buildings) {
      if (!groups.has(building.name)) {
        groups.set(building.name, []);
      }
      groups.get(building.name)!.push(building);
    }
    
    return groups;
  }

  static calculateTotalUpgradeCost(buildings: IBuilding[]): number {
    return buildings.reduce((total, building) => {
      return total + building.getUpgradeCost();
    }, 0);
  }
}
