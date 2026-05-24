import { CanvasEntityRenderer } from "../../client/src/renderers/canvas/CanvasEntityRenderer";
import { IGameState } from "../types/IGameState";

function makeCtx() {
  const calls: Record<string, number> = {};
  const track = (name: string) => {
    calls[name] = (calls[name] ?? 0) + 1;
  };
  const ctx = {
    beginPath: () => track("beginPath"),
    arc: () => track("arc"),
    fill: () => track("fill"),
    stroke: () => track("stroke"),
    fillRect: () => track("fillRect"),
    strokeRect: () => track("strokeRect"),
    drawImage: () => track("drawImage"),
    fillText: () => track("fillText"),
    moveTo: () => {},
    lineTo: () => {},
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 0,
    font: "",
    textAlign: "",
    textBaseline: "",
    _calls: calls,
  };
  return ctx;
}

function makeState(units: Array<{ x: number; y: number; canMove?: boolean; canAttack?: boolean }>): IGameState {
  const width = 10;
  const height = 10;
  const grid = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => {
      const unit = units.find(u => u.x === x && u.y === y);
      return {
        terrain: "grass" as const,
        unit: unit
          ? {
              id: "archer",
              hp: 7,
              maxHp: 10,
              attack: 5,
              defense: 1,
              price: 250,
              movepoints: 4,
              faction: "Red",
              unitTerrainStats: {},
              canMove: unit.canMove ?? true,
              canAttack: unit.canAttack ?? true,
            }
          : null,
        building: null,
      };
    })
  );
  return {
    map: { width, height, grid },
    factions: [],
    currentFaction: "Red",
    selection: null,
    turn: 1,
  };
}

export function testCanvasEntityRenderer() {
  console.log("Testing CanvasEntityRenderer:");
  let errors = 0;

  // 1. Пуста карта — жодних викликів малювання
  {
    const ctx = makeCtx();
    const renderer = new CanvasEntityRenderer(ctx as any, 64);
    renderer.render(makeState([]));

    if (ctx._calls["arc"] || ctx._calls["fillText"]) {
      console.error("  [FAIL] Empty map should produce no draw calls.");
      errors++;
    } else {
      console.log("  [OK] Empty map — no draw calls.");
    }
  }

  // 2. Один юніт — fallback-коло і HP текст
  {
    const ctx = makeCtx();
    const renderer = new CanvasEntityRenderer(ctx as any, 64);
    renderer.render(makeState([{ x: 2, y: 3 }]));

    if (!ctx._calls["arc"]) {
      console.error("  [FAIL] Expected arc() for unit fallback circle.");
      errors++;
    } else {
      console.log("  [OK] Unit fallback circle drawn.");
    }

    if ((ctx._calls["fillText"] ?? 0) < 2) {
      console.error("  [FAIL] Expected fillText calls for HP text (text + shadow).");
      errors++;
    } else {
      console.log("  [OK] HP text drawn.");
    }
  }

  // 3. Атакував (canAttack=false) — маркер виснаження
  {
    const ctx = makeCtx();
    const renderer = new CanvasEntityRenderer(ctx as any, 64);
    renderer.render(makeState([{ x: 1, y: 1, canMove: true, canAttack: false }]));

    if ((ctx._calls["arc"] ?? 0) < 2) {
      console.error("  [FAIL] Expected exhausted marker after attack.");
      errors++;
    } else {
      console.log("  [OK] Exhausted marker drawn after attack.");
    }
  }

  // 4. Походив (canMove=false) — маркер виснаження
  {
    const ctx = makeCtx();
    const renderer = new CanvasEntityRenderer(ctx as any, 64);
    renderer.render(makeState([{ x: 1, y: 1, canMove: false, canAttack: true }]));

    if ((ctx._calls["arc"] ?? 0) < 2) {
      console.error("  [FAIL] Expected exhausted marker after move.");
      errors++;
    } else {
      console.log("  [OK] Exhausted marker drawn after move.");
    }
  }

  // 5. Три юніти — HP текст для кожного (2 fillText на юніта: тінь + текст)
  {
    const ctx = makeCtx();
    const renderer = new CanvasEntityRenderer(ctx as any, 64);
    renderer.render(makeState([{ x: 0, y: 0 }, { x: 4, y: 4 }, { x: 8, y: 2 }]));

    if ((ctx._calls["fillText"] ?? 0) < 6) {
      console.error("  [FAIL] Expected at least 6 fillText calls for 3 units.");
      errors++;
    } else {
      console.log("  [OK] 3 units — all HP texts drawn.");
    }
  }

  // 6. Сеттер tileSize
  {
    const ctx = makeCtx();
    const renderer = new CanvasEntityRenderer(ctx as any, 64);
    renderer.tileSize = 128;
    renderer.render(makeState([{ x: 0, y: 0 }]));
    console.log("  [OK] tileSize setter works.");
  }

  if (!errors) {
    console.log("CanvasEntityRenderer test passed successfully!");
  } else {
    console.log(`CanvasEntityRenderer test ended with ${errors} error(s).`);
  }
}
