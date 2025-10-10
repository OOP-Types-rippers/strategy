import { ConsoleRenderer } from "../io/ConsoleRenderer";
import { GameController } from "../core/GameController";
import { Faction } from "../factions/Faction";
import { GameMap } from "../map/GameMap";

export function testGameController() {
  console.log("Testing Game Controller: ");

  const map = new GameMap(5, 5, "grass");
  const factionA = new Faction("red", 0xFF0000);
  const factionB = new Faction("blue", 0x0000FF);
  const renderer = new ConsoleRenderer();

  const game = new GameController(map, [factionA, factionB], renderer);

  let errors = 0;

  if (game.turn !== 1) {
    console.error(`Expected ${game.turn} to be 1`);
    errors++;
  }
  if (game.currentFaction !== game.factions[0]) {
    console.error(`Expected ${game.currentFaction.name} to be ${game.factions[0]}`);
    errors++;
  }
  game.nextTurn();
  if (game.turn !== 2) {
    console.error(`Expected ${game.turn} to be 2`);
    errors++;
  }
  if (game.currentFaction !== game.factions[1]) {
    console.error(`Expected ${game.currentFaction.name} to be ${game.factions[1]}`);
    errors++;
  }
  game.nextTurn()
  if (game.currentFaction !== game.factions[0]) {
    console.error(`Expected ${game.currentFaction.name} to be ${game.factions[0]}`);
    errors++;
  }

  if (!errors) {
    console.log("Testing ended successfully");
  } else {
    console.log(`Testing ended with ${errors} errors`);
  }
}