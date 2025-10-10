import { ITile } from "./ITile";

export interface IGameMap {
  width: number;
  height: number;
  grid: ITile[][];
}
