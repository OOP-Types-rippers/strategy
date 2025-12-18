import { Entity } from "../entities/Entity";

export function testUnitTerrainStatsGetter() {
  console.log("Testing UnitTerrainStats getter:");

  let errors = 0;

  // ---------- 1. Юніт без overrides ----------
  const entity = new Entity();

  if (typeof entity.UTS !== "object") {
    console.error("Getter UnitTerrainStats should return an object.");
    errors++;
  }

  if (Object.keys(entity.UTS).length !== 0) {
      ('Default UnitTerrainStats should be empty {}, got ${JSON.stringify(entity.UTS)'
    );
    errors++;
  }

  // ---------- 2. Присвоєння override на один тайл ----------
  entity.unitTerrainStats = {
    forest: { moveCost: 5 }
  };

  if (!entity.UTS.forest) {
    console.error("Expected forest override to exist.");
    errors++;
  }

  if (entity.UTS.forest!.moveCost !== 5) {
  console.error(`
    Expected UnitTerrainStats.forest.moveCost = 5, got ${entity.UTS.forest!.moveCost}
  `);
  errors++;
}

  // ---------- 3. Присвоєння декількох overrides ----------
  entity.unitTerrainStats = {
    forest: { moveCost: 5 },
    water: { moveCost: 1, defenseBonus: 2 }
  };

  if (entity.UTS.water!.moveCost !== 1) {
    console.error('Expected water.moveCost = 1, got ${entity.UTS.water!.moveCost}');
    errors++;
  }

  if (entity.UTS.water!.defenseBonus !== 2) {
    console.error('Expected water.defenseBonus = 2, got ${entity.UTS.water!.defenseBonus}'
    );
    errors++;
  }

  // ---------- 4. Перевірка на незалежність об'єкта ----------
  const original = entity.UTS;
  original.water!.moveCost = 999;

  if (entity.UTS.water!.moveCost !== 999) {
    console.error('Getter should return reference to the same object, got ${entity.UTS.water!.moveCost}'
    );
    errors++;
  }

  // ---------- Результат ----------
  if (!errors) {
    console.log("UnitTerrainStats getter test passed successfully!");
  } else {
    console.log('UnitTerrainStats getter test ended with ${errors} error(s).');
  }
}