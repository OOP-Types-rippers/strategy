import { BuildingManager } from '../../src/buildings/BuildingManager';
import { Castle } from '../../src/buildings/Castle';
import { Village } from '../../src/buildings/Village';

describe('BuildingManager', () => {
  let manager: BuildingManager;
  
  beforeEach(() => {
    manager = new BuildingManager();
  });
  
  test('should add building and get by ID', () => {
    const castle = new Castle({ x: 2, y: 3 });
    const id = manager.addBuilding(castle);
    
    expect(manager.getBuilding(id)).toBe(castle);
  });
  
  test('should not add building to occupied position', () => {
    const castle1 = new Castle({ x: 2, y: 3 });
    const castle2 = new Castle({ x: 2, y: 3 });
    
    manager.addBuilding(castle1);
    expect(() => manager.addBuilding(castle2)).toThrow();
  });
  
  test('should get building at position', () => {
    const castle = new Castle({ x: 2, y: 3 });
    manager.addBuilding(castle);
    
    expect(manager.getBuildingAt(2, 3)).toBe(castle);
    expect(manager.getBuildingAt(5, 5)).toBeNull();
  });
  
  test('should remove building', () => {
    const castle = new Castle({ x: 2, y: 3 });
    const id = manager.addBuilding(castle);
    
    expect(manager.removeBuilding(id)).toBe(true);
    expect(manager.getBuilding(id)).toBeNull();
    expect(manager.getBuildingAt(2, 3)).toBeNull();
  });
  
  test('should get buildings by type', () => {
    const castle1 = new Castle({ x: 1, y: 1 });
    const castle2 = new Castle({ x: 2, y: 2 });
    const village = new Village({ x: 3, y: 3 });
    
    manager.addBuilding(castle1);
    manager.addBuilding(castle2);
    manager.addBuilding(village);
    
    const castles = manager.getBuildingsByType('Castle');
    expect(castles).toHaveLength(2);
    
    const villages = manager.getBuildingsByType('Village');
    expect(villages).toHaveLength(1);
  });
  
  test('should find buildings in radius', () => {
    const castle1 = new Castle({ x: 0, y: 0 });
    const castle2 = new Castle({ x: 3, y: 4 });
    const village = new Village({ x: 10, y: 10 });
    
    manager.addBuilding(castle1);
    manager.addBuilding(castle2);
    manager.addBuilding(village);
    
    const nearby = manager.findBuildingsInRadius(0, 0, 5);
    expect(nearby).toHaveLength(1);
    
    const nearby2 = manager.findBuildingsInRadius(0, 0, 6);
    expect(nearby2).toHaveLength(2);
  });
});
