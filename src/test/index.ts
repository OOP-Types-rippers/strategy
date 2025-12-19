import { testGameMap } from "./gamemap.test";
import { testGameController } from "./gamecontroller.test";
import { testEntity } from "./entity.test";
import { testUnitTerrainStatsGetter } from "./unitTerrainStats.test";

void (async () => {
  testGameMap();
  console.log("\n===\n");
  await testGameController();
  console.log("\n===\n");
  testEntity();
  console.log("\n===\n");
  testUnitTerrainStatsGetter();
})()

