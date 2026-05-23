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
    this.element.classList.add("status-renderer");

    const turnBlock = this.createMetricBlock("Turn");
    this.turnValue = turnBlock.value;

    const currentFactionBlock = this.createMetricBlock("Current faction");
    this.currentFactionValue = currentFactionBlock.value;

    this.factionsList = document.createElement("div");
    this.factionsList.className = "status-renderer__factions";

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
    root.className = "status-renderer__metric";

    const label = document.createElement("span");
    label.className = "status-renderer__label";
    label.textContent = labelText;

    const value = document.createElement("strong");
    value.className = "status-renderer__value";

    root.replaceChildren(label, value);

    return { root, value };
  }

  private createFactionElement(faction: IFactionState, isActive: boolean): HTMLElement {
    const item = document.createElement("div");
    item.className = "status-renderer__faction";
    if (isActive) item.classList.add("status-renderer__faction--active");

    const swatch = document.createElement("span");
    swatch.className = "status-renderer__swatch";
    swatch.style.backgroundColor = this.toHexColor(faction.color);

    const name = document.createElement("span");
    name.className = "status-renderer__faction-name";
    name.textContent = faction.name;

    const money = document.createElement("span");
    money.className = "status-renderer__money";
    money.textContent = `${faction.money}G`;

    item.replaceChildren(swatch, name, money);

    return item;
  }

  private toHexColor(color: number): string {
    return `#${color.toString(16).padStart(6, "0").slice(-6)}`;
  }
}