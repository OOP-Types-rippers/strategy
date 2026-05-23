import { IFaction, IFactionState } from "../types/IFaction"

export class Faction implements IFaction {
  constructor(
    public name: string,
    public color: number,
    public money: number,
  ) {}

  getState(): IFactionState {
    return {
      name: this.name,
      color: this.color,
      money: this.money,
    }
  }
}

export function generateFactions(count: number, startingMoney: number = 100): Faction[] {
  if (count < 1 || count > 8) {
    throw new Error("Number of factions must be between 1 and 8");
  }

  const factions: Faction[] = [];
  for (let i = 0; i < count; i++) {
    factions.push(new Faction(FACTION_NAMES[i]!, FACTION_COLORS[i]!, startingMoney));
  }
  return factions;
}
