import { GameMap } from "../map/GameMap";

const map = new GameMap(5, 5, 'grass');
map.setTile(2, 2, "forest");
map.setTile(1, 3, "hill");
map.setTile(3, 4, "water");

const tile = map.getTile(2, 2)
if (tile.terrain !== "forest") {
  console.error("Tile isn't forest");
}
if (tile.moveCost !== 2) {
  console.error("Tile isn't moved");
}

console.log(`Tile 2, 2 is ${map.getTile(2, 2).terrain}, it's move cost is: ${map.getTile(2, 2).moveCost}, it's defence bonus is: ${map.getTile(2, 2).defenseBonus}`);
map.setTile(2, 2, "hill");
console.log(`Now it's changed into a ${map.getTile(2, 2).terrain}, it's move cost is: ${map.getTile(2, 2).moveCost}, it's defence bonus is: ${map.getTile(2, 2).defenseBonus}`);