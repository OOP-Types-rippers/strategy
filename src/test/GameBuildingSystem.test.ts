import { GameBuildingSystem } from '../../src/types/buildings/GameBuildingSystem.ts';

describe('GameBuildingSystem', () => {
  let system: GameBuildingSystem;
  beforeEach(() => {
    system = new GameBuildingSystem();
  });
  test('should create building using factory', () => {
    const id = system.createBuilding('Castle', 2, 3);
    expect(id).toBeTruthy();
  });
  
  test('should upgrade building', () => {
    const id = system.createBuilding('Village', 5, 5);
    const upgraded = system.upgradeBuilding(id);
    expect(upgraded).toBe(true);
    const stats = system.getStatistics();
    expect(stats.averageLevel).toBe(2);
  });
  
  test('should get upgrade recommendations', () => {
    system.createBuilding('Castle', 0, 0);
    system.createBuilding('Village', 2, 2);
    const recommendations = system.getUpgradeRecommendations();
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0]).toHaveProperty('priority');
  });
  
  test('should export and import state', () => {
    system.createBuilding('Castle', 1, 1);
    system.createBuilding('Village', 2, 2);
    const exported = system.exportState();
    expect(typeof exported).toBe('string');
    expect(exported).toContain('Castle');
    expect(exported).toContain('Village');
    const newSystem = new GameBuildingSystem();
    newSystem.importState(exported, { factions: [] });
    const stats = newSystem.getStatistics();
    expect(stats.total).toBe(2);
  });
});
