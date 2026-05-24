import { GameController } from "../../src/core/GameController";
import { HTMLRenderer } from "./renderers/HTMLRenderer";
import { MapGenerator } from "../../src/map/MapGenerator";
import { FactionsGenerator } from "../../src/factions/FactionsGenerator";
import { HTMLInputController } from "./io/HTMLInputController";
import { Soldier } from "../../src/entities/Entity";

function createGame(width: number, height: number, factionCount: number) {
  const mapGenerator = new MapGenerator();
  const map = mapGenerator.generateMap(width, height);

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

function restoreState() {
  const titleElement = document.querySelector<HTMLDivElement>(".win-title");
  if (titleElement) {
    titleElement.style.display = "none";
  }
}

const form = document.querySelector<HTMLFormElement>("#new-game-form")
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  restoreState();

  const formData = new FormData(form);
  let width = parseInt(formData.get("width") as string) || 16;
  width = Math.min(Math.max(width, 5), 64);
  let height = parseInt(formData.get("height") as string) || 16;
  height = Math.min(Math.max(height, 5), 64);
  let factionsCount = parseInt(formData.get("factions") as string) || 2;
  factionsCount = Math.min(Math.max(factionsCount, 2), 8);

  const newGame = createGame(width, height, factionsCount);
  newGame.start();
});
