import { InputController } from "./InputController";

export class RobotInputController extends InputController {
  async startTurn(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.makeMove();
  }

  private makeMove(): void {
    const map = this.gameController.map;

    const units: { x: number, y: number }[] = []
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const tile = map.getTile(x, y);
        const unit = tile.unit;
        if (unit && unit.faction === this.gameController.currentFaction && unit.canMove)
          units.push({ x, y });
      }
    }

    for (const pos of units) {
      const directions = [
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 },
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
      ];

      // shuffling
      for (let i = directions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [directions[i], directions[j]] = [directions[j]!, directions[i]!];
      }

      for (const dir of directions) {
        const nx = pos.x + dir.dx;
        const ny = pos.y + dir.dy;

        if (nx >= 0 && nx < map.width && ny >= 0 && ny < map.height) {
          const targetTile = map.getTile(nx, ny);

          if (!targetTile.unit) {
            this.gameController.selectTile(pos.x, pos.y);
            this.gameController.selectTile(nx, ny);
            pos.x = nx;
            pos.y = ny;
            break;
          }
        }
      }

      for (const dir of directions) {
        const nx = pos.x + dir.dx;
        const ny = pos.y + dir.dy;

        if (nx >= 0 && nx < map.width && ny >= 0 && ny < map.height) {
          const unit = map.getTile(nx, ny).unit
          if (unit && unit.faction !== this.gameController.currentFaction) {
            this.gameController.selectTile(pos.x, pos.y);
            this.gameController.selectTile(nx, ny);
            break;
          }
        }
      }
    }

    this.endTurn();
  }
}