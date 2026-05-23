import { Faction } from "./Faction";

export class FactionsGenerator {
  FACTION_NAMES = [
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Cyan",
    "Magenta",
    "Orange",
    "Purple",
  ];

  FACTION_COLORS = [
    0xFF0000, // Red
    0x0000FF, // Blue
    0x00FF00, // Green
    0xFFFF00, // Yellow
    0x00FFFF, // Cyan
    0xFF00FF, // Magenta
    0xFFA500, // Orange
    0x800080, // Purple
  ];

  public generateFactions(count: number, startingMoney: number = 1000): Faction[] {
    if (count < 1 || count > 8) {
      throw new Error("Number of factions must be between 1 and 8");
    }

    const factions: Faction[] = [];
    for (let i = 0; i < count; i++) {
      factions.push(new Faction(this.FACTION_NAMES[i]!, this.FACTION_COLORS[i]!, startingMoney));
    }
    return factions;
  }
}
