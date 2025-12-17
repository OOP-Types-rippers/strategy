import { GameMap } from "../map/GameMap";

export function testGameMap() {
    console.log("Testing game map:\n");
    const map = new GameMap(5, 5, "grass");

    console.log("The map was created:");
    map.print();

    map.setTile(1, 1, "forest");
    map.setTile(0, 2, "hill");
    map.setTile(2, 3, "water");
    console.log("Some tiles were changed:");
    map.print();

    console.log(`Tile 1, 3 is ${map.getTile(0, 2).terrain}, it's move cost is: ${map.getTile(0, 2).moveCost}, it's defense bonus is: ${map.getTile(0, 2).defenseBonus}`);
    map.setTile(0, 2, "road");
    console.log(`Now it's changed into a ${map.getTile(0, 2).terrain}, it's move cost is: ${map.getTile(0, 2).moveCost}, it's defense bonus is: ${map.getTile(0, 2).defenseBonus}`);
    map.print();

    map.setRow("grass");
    map.setCol("water")
    console.log("A new grass row and water col were added:")
    map.print();

    map.clear();
    console.log("The map was cleared.");
    map.print();
}

testGameMap();