import { IBuilding } from "../types/IBuilding";

export class BuildingManager {
  private buildings: Map<string, IBuilding>; 
  private positionIndex: Map<string, string>; 
  private typeIndex: Map<string, Set<string>>;
  
  constructor() {
    this.buildings = new Map();
    this.positionIndex = new Map();
    this.typeIndex = new Map();
  }
  
  private generateId(building: IBuilding): string {
    return `${building.name}_${building.position.x}_${building.position.y}_${Date.now()}`;
  }
  
  private getPositionKey(x: number, y: number): string {
    return `${x},${y}`;
  }
  
  addBuilding(building: IBuilding): string {
    const posKey = this.getPositionKey(building.position.x, building.position.y);

    if (this.positionIndex.has(posKey)) {
      throw new Error(`Position (${building.position.x}, ${building.position.y}) is already occupied`);
    }
    
    const id = this.generateId(building);
    this.buildings.set(id, building);
    this.positionIndex.set(posKey, id);

    if (!this.typeIndex.has(building.name)) {
      this.typeIndex.set(building.name, new Set());
    }
    this.typeIndex.get(building.name)!.add(id);
    
    return id;
  }
  
  removeBuilding(id: string): boolean {
    const building = this.buildings.get(id);
    if (!building) return false;
    
    const posKey = this.getPositionKey(building.position.x, building.position.y);
    
    this.buildings.delete(id);
    this.positionIndex.delete(posKey);
    this.typeIndex.get(building.name)?.delete(id);
    
    return true;
  }

  getBuilding(id: string): IBuilding | null {
    return this.buildings.get(id) || null;
  }

  getBuildingAt(x: number, y: number): IBuilding | null {
    const posKey = this.getPositionKey(x, y);
    const id = this.positionIndex.get(posKey);
    return id ? this.buildings.get(id) || null : null;
  }

  getAllBuildings(): IBuilding[] {
    return Array.from(this.buildings.values());
  }

  getBuildingsByType(type: string): IBuilding[] {
    const ids = this.typeIndex.get(type);
    if (!ids) return [];
    
    return Array.from(ids)
      .map(id => this.buildings.get(id))
      .filter((b): b is IBuilding => b !== undefined);
  }
  
  activateBuildingsByType(type: string): void {
    this.getBuildingsByType(type).forEach(building => building.activate());
  }

  getStatistics(): { total: number; byType: Record<string, number> } {
    const byType: Record<string, number> = {};
    
    this.typeIndex.forEach((ids, type) => {
      byType[type] = ids.size;
    });
    
    return {
      total: this.buildings.size,
      byType
    };
  }
  
  clear(): void {
    this.buildings.clear();
    this.positionIndex.clear();
    this.typeIndex.clear();
  }
}
