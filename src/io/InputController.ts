import { GameController } from "../core/GameController";

export abstract class InputController {
  constructor(protected gameController: GameController) {}

  abstract startTurn(): Promise<void>;

  protected endTurn(): void {
    this.gameController.nextTurn();
  }
}