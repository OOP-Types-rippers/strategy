import { Castle } from '../../src/types/buildings/Castle';
import { Village } from '../../src/types/buildings/Village';
import { BuildingAlgorithms } from '../../src/types/buildings/BuildingAlgorithms';

describe('BuildingAlgorithms', () => {
  let buildings: any[];
  
  beforeEach(() => {
    buildings = [
      new Castle({ x: 0, y: 0 }),
      new Castle({ x: 5, y: 5 }),
      new Village({ x: 2, y: 2 }),
      new Village({ x: 10, y: 10 }),
    ];

    buildings[0].level = 3;
    buildings[1].level = 1;
    buildings[2].level = 2;
    buildings[3].level = 4;
  });
  
  test('should sort buildings by level descending', () => {
    const sorted = BuildingAlgorithms.sortByLevel(buildings);
    expect(sorted[0].level).toBe(4); 
    expect(sorted[1].level).toBe(3); 
    expect(sorted[2].level).toBe(2); 
    expect(sorted[3].level).toBe(1); 
  });
  
  test('should filter buildings by type and level', () => {
    const castles = BuildingAlgorithms.filterByTypeAndLevel(buildings, 'Castle', 2);
    expect(castles).toHaveLength(1);
    expect(castles[0].level).toBe(3);
    
    const villages = BuildingAlgorithms.filterByTypeAndLevel(buildings, 'Village', 3);
    expect(villages).toHaveLength(1);
    expect(villages[0].level).toBe(4);
  });
  
  test('should find nearest building', () => {
    const nearest = BuildingAlgorithms.findNearestBuilding(buildings, 1, 1);
    expect(nearest).toBe(buildings[2]); 
  });
  
  test('should group buildings by type', () => {
    const groups = BuildingAlgorithms.groupByType(buildings);
    expect(groups.get('Castle')).toHaveLength(2);
    expect(groups.get('Village')).toHaveLength(2);
  });
});
