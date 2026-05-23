import { IFaction } from "../types/IFaction";
import { IGameState } from "../types/IGameState";
import { IRenderer } from "../types/IRenderer";

export class ConsoleRenderer implements IRenderer {
  render(state: IGameState) {
    process.stdout.write("\x1Bc")

    const factionsInfo = state.factions
      .map(f => `${f.name === state.currentFaction ? '>> ' : ''}${f.name}: ${f.money}G`)
      .join("  |  ");
    console.log("=== Factions ===");
    console.log(factionsInfo);
    console.log(`Current turn: ${state.turn}\n`);

    const horizontalSeparator = "-".repeat((state.map.width * 3 + 1) + 4);

    const xScale = "  |" + Array.from({ length: state.map.width }, (_, i) => i.toString().padStart(2, " ")).join("|") + "|  ";
    console.log(xScale);
    console.log(horizontalSeparator);

    state.map.grid.forEach((row, y) => {
      const rowStr = row.map((tile) => {
        const unitChar = tile.unit?.id[0]?.toUpperCase() ?? " ";
        const terrainChar = tile.terrain === "grass" ? "." : tile.terrain[0]!.toUpperCase();
        return unitChar + terrainChar;
      }).join("|");

      console.log(y.toString().padStart(2, " ") + "|" + rowStr + "|  ");
      if (y < state.map.height - 1) console.log(horizontalSeparator);
    })
  }

  caption(winner: IFaction | null, turns: number): void {
    const winnerName = winner?.name ?? "none";
    console.log(`${winnerName} wins in ${turns} turns`);
  }
}
