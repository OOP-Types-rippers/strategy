import { GameController } from "../../src/core/GameController";
import { HTMLRenderer } from "./renderers/HTMLRenderer";
import { MapGenerator } from "../../src/map/MapGenerator";
import { FactionsGenerator } from "../../src/factions/FactionsGenerator";
import { HTMLInputController } from "./io/HTMLInputController";
import { Soldier } from "../../src/entities/Entity";

function createGame(mapSize: number, factionCount: number) {
  const mapGenerator = new MapGenerator();
  const map = mapGenerator.generateMap(mapSize, mapSize);

  const renderer = new HTMLRenderer();

  const factionsGenerator = new FactionsGenerator();
  const factions = factionsGenerator.generateFactions(factionCount);

  
  const gameController = new GameController(map, factions, renderer);

  const inputController = new HTMLInputController(gameController, renderer);
  for (let i = 0; i < factions.length; i++) {
    const faction = factions[i]!
    gameController.registerController(faction, inputController);

    const soldier = new Soldier();
    soldier.faction = faction;
    map.placeEntity(i, i, soldier);
  }

  return gameController;
}

const game = createGame(16, 2);
game.start();
