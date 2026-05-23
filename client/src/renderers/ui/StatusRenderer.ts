import { IGameState } from "../../../../src/types/IGameState";
import { IRenderer } from "../../../../src/types/IRenderer";
import { IFactionState } from "../../../../src/types/IFaction";

export class StatusRenderer implements IRenderer {
  private turnValue: HTMLElement;
  private currentFactionValue: HTMLElement;
  private factionsList: HTMLElement;

  constructor(
    private element: HTMLElement,
  ) {
    const turnBlock = this.createMetricBlock("Turn");
    this.turnValue = turnBlock.value;

    const currentFactionBlock = this.createMetricBlock("Current faction");
    this.currentFactionValue = currentFactionBlock.value;

    this.factionsList = document.createElement("div");
    this.factionsList.className = "status-rendered-factions";

    this.element.replaceChildren(
      turnBlock.root,
      currentFactionBlock.root,
      this.factionsList,
    );
  }
  
  public render(state: IGameState): void {
    this.turnValue.textContent = String(state.turn);
    this.currentFactionValue.textContent = state.currentFaction;

    const factionElements = state.factions.map((faction) =>
      this.createFactionElement(faction, faction.name === state.currentFaction),
    );

    this.factionsList.replaceChildren(...factionElements);
  }

  private createMetricBlock(labelText: string): { root: HTMLElement; value: HTMLElement } {
    const root = document.createElement("div");
    root.className = "status-rendered-metric";

    const label = document.createElement("span");
    label.className = "status-rendered-label";
    label.textContent = labelText;

    const value = document.createElement("strong");
    value.className = "status-rendered-value";

    root.replaceChildren(label, value);

    return { root, value };
  }

  private createFactionElement(faction: IFactionState, isActive: boolean): HTMLElement {
    const item = document.createElement("div");
    item.className = "status-rendered-faction";
    if (isActive) item.classList.add("status-rendered-faction-active");

    const swatch = document.createElement("span");
    swatch.className = "status-rendered-swatch";
    swatch.style.backgroundColor = this.toHexColor(faction.color);

    const name = document.createElement("span");
    name.className = "status-rendered-faction-name";
    name.textContent = faction.name;

    const money = document.createElement("span");
    money.className = "status-rendered-money";
    money.textContent = `${faction.money}G`;

    item.replaceChildren(swatch, name, money);

    return item;
  }

  private toHexColor(color: number): string {
    return `#${color.toString(16).padStart(6, "0").slice(-6)}`;
  }
}
