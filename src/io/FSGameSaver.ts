import * as fs from "node:fs";
import { resolve, } from "node:path";
import { IGameSaver } from "../types/IGameSaver";
import { IGameState } from "../types/IGameState";

const savesFolder = resolve(__dirname, "../../saves");

export class FSGameSaver implements IGameSaver {
  public save(state: IGameState, name: string): boolean {
    if (!fs.existsSync(savesFolder)) fs.mkdirSync(savesFolder)

    const saveFileName = name + ".save.json";
    const saveFileData = JSON.stringify(state, null, 4);

    try {
      fs.writeFileSync(resolve(savesFolder, saveFileName), saveFileData, "utf-8");
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  public load(name: string): IGameState {
    const saveFileName = name + ".save.json";
    try {
      const data = fs.readFileSync(resolve(savesFolder, saveFileName), "utf-8");
      return JSON.parse(data);
    } catch (e) {
      console.error(e);
      throw new Error("unable to load save file");
    }
  }

  public delete(name: string): boolean {
    const saveFileName = name + ".save.json";
    try {
      fs.rmSync(resolve(savesFolder, saveFileName));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
