import { Archer } from "../entities/Entity"
import { GameMap } from "../map/GameMap";
import { MapGenerator } from "../map/MapGenerator";

export function testGameMap() {
    console.log("Testing game map:\n");

    const mapGenerator = new MapGenerator();
    const map = mapGenerator.generateMap(4, 4);

    console.log(`The map was created with a seed: ${mapGenerator.seed}`);
    map.print();

    const randomX1 : number = Math.floor(Math.random() * map.width);
    const randomY1 : number = Math.floor(Math.random() * map.height);
    const randomX2 : number = Math.floor(Math.random() * map.width);
    const randomY2 : number = Math.floor(Math.random() * map.height);
    const randomX3 : number = Math.floor(Math.random() * map.width);
    const randomY3 : number = Math.floor(Math.random() * map.height);
    const randomX4 : number = Math.floor(Math.random() * map.width);
    const randomY4 : number = Math.floor(Math.random() * map.height);
    const randomX5 : number = Math.floor(Math.random() * map.width);
    const randomY5 : number = Math.floor(Math.random() * map.height);
    const randomX6 : number = Math.floor(Math.random() * map.width);
    const randomY6 : number = Math.floor(Math.random() * map.height);
    const randomX7 : number = Math.floor(Math.random() * map.width);
    const randomY7 : number = Math.floor(Math.random() * map.height);

    map.setTile(randomX1, randomY1, "forest");
    map.setTile(randomX2, randomY2, "hill");
    map.setTile(randomX3, randomY3, "water");
    console.log("Some tiles were changed:");
    map.print();

    console.log(`Tile ${randomX2}, ${randomY2} is ${map.getTile(randomX2, randomY2).terrain}, it's move cost is: ${map.getTile(randomX2, randomY2).moveCost}, it's defense bonus is: ${map.getTile(randomX2, randomY2).defenseBonus}`);
    map.setTile(randomX2, randomY2, "road");
    console.log(`Now it's changed into a ${map.getTile(randomX2, randomY2).terrain}, it's move cost is: ${map.getTile(randomX2, randomY2).moveCost}, it's defense bonus is: ${map.getTile(randomX2, randomY2).defenseBonus}`);
    map.print();

    map.setRow("grass");
    map.setCol("water")
    console.log("A new grass row and water col were added:")
    map.print();

    console.log(`Distance between ${randomX4}, ${randomY4} and ${randomX5}, ${randomY5} equals: ${map.getDistance(randomX4, randomY4, randomX5, randomY5)}`);
    const weightedMap = new GameMap(4, 2, "road");
    weightedMap.setTile(1, 0, "mountain");
    weightedMap.setTile(2, 0, "mountain");
    if (weightedMap.getDistance(0, 0, 3, 0) !== 5) {
        console.error(`Expected weighted distance to prefer road path with cost 5`);
    }

    let archer: Archer = new Archer();
    map.placeEntity(randomX5, randomY5, archer);
    console.log(`The Unit ${archer.id} was placed on ${archer.PosX}, ${archer.posY}. Distance between Archer and ${randomX6}, ${randomY6} equals: ${map.getDistanceUnitTile(archer, randomX6, randomY6)}`);

    map.moveEntity(archer, randomX7, randomY7);
    console.log(`The Archer has been moved on ${archer.posX}, ${archer.posY}`);

    map.clear();
    console.log("The map was cleared.");
    map.print();
}