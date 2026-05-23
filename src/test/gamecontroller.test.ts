import { GameController } from "../core/GameController";
import { Faction } from "../factions/Faction";
import { GameMap } from "../map/GameMap";
import { Entity, Knight } from "../entities/Entity";
import { FSGameSaver } from "../io/FSGameSaver";
import { TestRenderer } from "../io/TestRenderer";

export async function testGameController() {
  console.log("Testing Game Controller: ");

  const map = new GameMap(5, 5, "grass");
  const factionA = new Faction("red", 0xFF0000, 100);
  const unitA = new Knight();
  unitA.faction = factionA;
  map.placeEntity(4, 4, unitA);

  const factionB = new Faction("blue", 0x0000FF, 100);
  const unitB = new Knight();
  unitB.faction = factionB;
  map.placeEntity(3, 4, unitB);


  const renderer = new TestRenderer();
  const saver = new FSGameSaver();

  const game = new GameController(map, [factionA, factionB], renderer, saver);

  let errors = 0;

  if (game.turn !== 1) {
    console.error(`Expected ${game.turn} to be 1`);
    errors++;
  }
  if (game.currentFaction !== game.factions[0]) {
    console.error(`Expected ${game.currentFaction.name} to be ${game.factions[0]}`);
    errors++;
  }
  await game.nextTurn();
  if (game.turn !== 2) {
    console.error(`Expected ${game.turn} to be 2`);
    errors++;
  }
  if (game.currentFaction !== game.factions[1]) {
    console.error(`Expected ${game.currentFaction.name} to be ${game.factions[1]}`);
    errors++;
  }
  await game.nextTurn();
  if (game.currentFaction !== game.factions[0]) {
    console.error(`Expected ${game.currentFaction.name} to be ${game.factions[0]}`);
    errors++;
  }

  game.selectTile(0, 0)
  if (game.selectedTile?.x !== 0 || game.selectedTile?.y !== 0) {
    console.error(`Expected tile at (0, 0) to be selected`);
    errors++;
  }

  game.unselectTile()
  if (game.selectedTile !== null) {
    console.error(`Expected selected tile to be null`);
    errors++;
  }

  // state test
  game.map.setTile(0, 0, "water");
  const entity = new Entity();
  const typeId = "Barbarian";
  entity.id = typeId;
  game.map.placeEntity(0, 0, entity);
  game.saveState();

  game.map.getTile(0, 0).unit = null;
  game.map.setTile(0, 0, "mountain");
  game.saveState();

  const saveName = "test-save-0";
  game.saveGame(saveName);
  
  game.prev();
  if (game.map.getTile(0, 0).unit?.id !== typeId) {
    console.error(`Expected unit with id ${typeId} at (0, 0)`);
    errors++;
  }

  game.loadGame(saveName)
  if (game.map.getTile(0, 0).terrain !== "mountain") {
    console.error(`Expected mountain terrain at (0, 0) after save`);
    errors++
  }

  game.deleteSave(saveName);

  if (!errors) {
    console.log("Testing ended successfully");
  } else {
    console.log(`Testing ended with ${errors} errors`);
  }
}