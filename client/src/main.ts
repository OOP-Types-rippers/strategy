import { GameController } from "../../src/core/GameController";
import { HTMLRenderer } from "./renderers/HTMLRenderer";
import { MapGenerator } from "../../src/map/MapGenerator";
import { FactionsGenerator } from "../../src/factions/FactionsGenerator";
import { HTMLInputController } from "./io/HTMLInputController";
import { Knight, Soldier } from "../../src/entities/Entity";

function createGame(width: number, height: number, seed: number, factionCount: number) {
  const mapGenerator = new MapGenerator(seed);
  const map = mapGenerator.generateMap(width, height);

  const renderer = new HTMLRenderer();

  const factionsGenerator = new FactionsGenerator();
  const factions = factionsGenerator.generateFactions(factionCount);

  const gameController = new GameController(map, factions, renderer);

  const inputController = new HTMLInputController(gameController, renderer);
  const midX = Math.floor(width / 2);
  const midY = Math.floor(height / 2);
  const positions = [
    { sx: 0, sy: 0, kx: 1, ky: 0 }, // Гравець 1: Лівий верхній кут
    { sx: width - 1, sy: 0, kx: width - 2, ky: 0 }, // Гравець 2: Правий верхній кут
    { sx: 0, sy: height - 1, kx: 1, ky: height - 1 }, // Гравець 3: Лівий нижній кут
    { sx: width - 1, sy: height - 1, kx: width - 2, ky: height - 1 }, // Гравець 4: Правий нижній кут
    { sx: midX, sy: midY, kx: midX + 1, ky: midY } // Гравець 5: Центр
  ];

  for (let i = 0; i < factions.length; i++) {
    const faction = factions[i]!
    gameController.registerController(faction, inputController);

    const pos = positions[i]!;

    const soldier = new Soldier();
    soldier.faction = faction;
    map.placeEntity(pos.sx, pos.sy, soldier);

    const knight = new Knight();
    knight.faction = faction;
    map.placeEntity(pos.kx, pos.ky, knight);
  }

  return gameController;
}

function restoreState() {
  const titleElement = document.querySelector<HTMLDivElement>(".win-title");
  if (titleElement) {
    titleElement.style.display = "none";
  }

  const canvasElement = document.querySelector<HTMLCanvasElement>("#map");
  if (canvasElement) {
    const newCanvas = canvasElement.cloneNode(true) as HTMLCanvasElement;
    newCanvas.removeAttribute("width");
    newCanvas.removeAttribute("height");
    canvasElement.replaceWith(newCanvas);
  }
}

const form = document.querySelector<HTMLFormElement>("#new-game-form")
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  restoreState();

  const formData = new FormData(form);
  let width = parseInt(formData.get("width") as string) || 12;
  width = Math.min(Math.max(width, 5), 20);
  let height = parseInt(formData.get("height") as string) || 12;
  height = Math.min(Math.max(height, 5), 20);
  let factionsCount = parseInt(formData.get("players-amount") as string) || 2;
  factionsCount = Math.min(Math.max(factionsCount, 2), 5);
  const seed = parseInt(formData.get("map-seed") as string) || 42;

  const newGame = createGame(width, height, seed, factionsCount);
  newGame.start();
});
