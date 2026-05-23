import { GameController } from "../../src/core/GameController";
import { HTMLRenderer } from "./renderers/HTMLRenderer";
import { MapGenerator } from "../../src/map/MapGenerator";
<<<<<<< Updated upstream
import { FactionsGenerator } from "../../src/factions/FactionsGenerator";

function createGame(mapSize: number, factionCount: number) {
  const mapGenerator = new MapGenerator();
  const map = mapGenerator.generateMap(mapSize, mapSize);

  const renderer = new HTMLRenderer();

  const factionsGenerator = new FactionsGenerator();
  const factions = factionsGenerator.generateFactions(factionCount);

  const gameController = new GameController(map, factions, renderer);
  // TODO: assign inputs

  return gameController;
}
=======

function createGame(mapSize: number, factionCount: number) {
  const mapGenerator = new MapGenerator();
  const map = mapGenerator.generateMap(16, 8);

  const renderer = new HTMLRenderer();

  const gameController = new GameController();
}

>>>>>>> Stashed changes
