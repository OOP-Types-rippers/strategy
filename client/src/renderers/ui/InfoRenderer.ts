import type { IGameState } from "../../../../src/types/IGameState";
import type { IRenderer } from "../../../../src/types/IRenderer";
import type { IBuildingState } from "../../../../src/types/IBuilding";
import type { IEntityState } from "../../../../src/types/IEntity";
import type { ITileState } from "../../../../src/types/ITile";
import { terrainStats } from "../../../../src/map/Tile";

export class InfoRenderer implements IRenderer {
  private title: HTMLElement;
  private content: HTMLElement;

  constructor(
    private element: HTMLElement
  ) {
    this.title = document.createElement("div");
    this.title.className = "info-rendered-title";

    this.content = document.createElement("div");
    this.content.className = "info-rendered-content";

    this.element.replaceChildren(this.title, this.content);
  }

  public render(state: IGameState): void {
    const selection = state.selection;

    if (!selection) {
      this.title.textContent = "No tile selected";
      this.content.replaceChildren(this.createEmptyMessage("Awaiting selection."));
      return;
    }

    const tile = state.map.grid[selection.y]?.[selection.x];

    if (!tile) {
      this.title.textContent = `Tile (${selection.x}, ${selection.y})`;
      this.content.replaceChildren(this.createEmptyMessage("Selected tile is outside of the map."));
      return;
    }

    this.title.textContent = `Tile (${selection.x}, ${selection.y})`;
    this.content.replaceChildren(
      this.createTerrainSection(tile),
      this.createUnitSection(tile.unit),
      this.createBuildingSection(tile.building),
    );
  }

  private createTerrainSection(tile: ITileState): HTMLElement {
    return this.createSection("Terrain", [
      ["Type", this.formatLabel(tile.terrain)],
      ["Move cost", String(tile.unit?.unitTerrainStats[tile.terrain]?.moveCost ?? terrainStats[tile.terrain].moveCost)],
      ["Defense bonus", String(tile.unit?.unitTerrainStats[tile.terrain]?.defenseBonus ?? terrainStats[tile.terrain].defenseBonus)],
    ]);
  }

  private createUnitSection(unit: IEntityState | null): HTMLElement {
    if (!unit) return this.createSection("Unit", [["Status", "Empty"]]);

    return this.createSection("Unit", [
      ["Type", this.formatLabel(unit.id || "unknown")],
      ["Faction", unit.faction ?? "Neutral"],
      ["HP", `${unit.hp}/${unit.maxHp}`],
      ["Attack", String(unit.attack)],
      ["Defense", String(unit.defense)],
      ["Move points", String(unit.movepoints)],
      ["Can move", this.formatBoolean(unit.canMove)],
      ["Can attack", this.formatBoolean(unit.canAttack)],
      ["Price", `${unit.price}G`],
    ]);
  }

  private createBuildingSection(building: IBuildingState | null): HTMLElement {
    if (!building) return this.createSection("Building", [["Status", "None"]]);

    return this.createSection("Building", [
      ["Type", this.formatLabel(building.type)],
      ["Level", String(building.level)],
      ["Active", this.formatBoolean(building.isActive)],
      ["Position", `(${building.x}, ${building.y})`],
    ]);
  }

  private createSection(titleText: string, rows: [string, string][]): HTMLElement {
    const section = document.createElement("section");
    section.className = "info-rendered-section";

    const title = document.createElement("h2");
    title.className = "info-rendered-section-title";
    title.textContent = titleText;

    const list = document.createElement("dl");
    list.className = "info-rendered-list";

    for (const [labelText, valueText] of rows) {
      const label = document.createElement("dt");
      label.className = "info-rendered-label";
      label.textContent = labelText;

      const value = document.createElement("dd");
      value.className = "info-rendered-value";
      value.textContent = valueText;

      list.append(label, value);
    }

    section.replaceChildren(title, list);
    return section;
  }

  private createEmptyMessage(message: string): HTMLElement {
    const paragraph = document.createElement("p");
    paragraph.className = "info-rendered-empty";
    paragraph.textContent = message;
    return paragraph;
  }

  private formatBoolean(value: boolean): string {
    return value ? "Yes" : "No";
  }

  private formatLabel(value: string): string {
    return value
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

}
