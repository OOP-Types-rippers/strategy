import { UnitSpriteMapper } from "../io/UnitSpriteMapper";

export function testUnitSpriteMapper(): void {
  console.log("=== Testing UnitSpriteMapper ===");

  const check = (testName: string, actual: string | boolean, expected: string | boolean): void => {
    console.log(`\nTest: ${testName}`);
    console.log(`Expected: ${expected}`);
    console.log(`Actual:   ${actual}`);

    if (actual !== expected) {
      throw new Error(`${testName} failed`);
    }

    console.log("Result: passed");
  };

  const soldierSprite = UnitSpriteMapper.getSprite("soldier");
  check("Get soldier sprite", soldierSprite, "/sprites/soldier.png");

  const archerSprite = UnitSpriteMapper.getSprite("archer");
  check("Get archer sprite", archerSprite, "/sprites/archer.png");

  const unknownSprite = UnitSpriteMapper.getSpriteOrDefault("unknown");
  check("Get default sprite for unknown unit", unknownSprite, "/sprites/default.png");

  const hasSoldier = UnitSpriteMapper.hasSprite("soldier");
  check("Check if soldier sprite exists", hasSoldier, true);

  const hasUnknown = UnitSpriteMapper.hasSprite("unknown");
  check("Check if unknown sprite does not exist", hasUnknown, false);

  console.log("\nRegistering new unit sprite...");
  UnitSpriteMapper.registerSprite("test_unit", "/sprites/test_unit.png");

  const testSprite = UnitSpriteMapper.getSprite("test_unit");
  check("Get registered test_unit sprite", testSprite, "/sprites/test_unit.png");

  console.log("\nAll available sprites:");
  console.log(UnitSpriteMapper.getAllSprites());

  console.log("\n=== All UnitSpriteMapper tests passed ===");
}