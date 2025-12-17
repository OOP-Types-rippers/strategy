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
