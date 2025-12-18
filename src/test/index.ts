import { testGameMap } from "./gamemap.test";
import { testGameController } from "./gamecontroller.test";
import { testEntity } from "./entity.test";
import { testUnitTerrainStatsGetter } from "./unitTerrainStats.test";

testGameMap();
console.log("\n===\n");
testGameController();
console.log("\n===\n");
testEntity();
console.log("\n===\n");
testUnitTerrainStatsGetter();

