import { GameController } from "../../core/GameController";
import { Soldier } from "../../entities/Entity";
import { Faction } from "../../factions/Faction";
import { ConsoleRenderer } from "../../io/ConsoleRenderer";
import { FSGameSaver } from "../../io/FSGameSaver";
import { RobotInputController } from "../../io/RobotInputController";
import { GameMap } from "../../map/GameMap";


const botA = new Faction("bot A", 0xFF0000, 100);
const botB = new Faction("bot B", 0x0000FF, 100);
const factions = [botA, botB];


const map = new GameMap(3, 3, "grass");

const unitA1 = new Soldier();
unitA1.faction = botA;
map.placeEntity(0, 0, unitA1);

const unitB1 = new Soldier();
unitB1.faction = botB;
map.placeEntity(2, 2, unitB1);

const renderer = new ConsoleRenderer();
const saver = new FSGameSaver();


const game = new GameController(map, factions, renderer, saver);
game.registerController(botA, new RobotInputController(game));
game.registerController(botB, new RobotInputController(game));


game.start().catch(console.error);