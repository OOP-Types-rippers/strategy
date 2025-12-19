import { InputController } from "./InputController";

export class HumanInputController extends InputController {
  async startTurn() {
    console.log(`${this.gameController.currentFaction.name} turn`);
  }

  public handleTileClick(x: number, y: number): void {
    this.gameController.selectTile(x, y);
  }

  public handleCancel(): void {
    this.gameController.unselectTile();
  }

  public handleEndTurn(): void {
    this.endTurn();
  }
}