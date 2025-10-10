import { IFaction } from "../types/IFaction"

export class Faction implements IFaction {
  constructor(
    public name: string,
    public color: number,
  ) {}
}
