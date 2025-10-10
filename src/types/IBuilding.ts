export interface IBuilding {
  name: string;
  position: { x: number; y: number };
  activate(): void;
  info(): string;
}

class Building {
  static Castle = class implements IBuilding{
    name: string;
    position:{x:number; y:number};
    availableUnits: string[];

    constructor(position:{x:number; y:number}, availableUnits: string[]=["//класи персонажів", ""]){
      this.name = "Castle";
      this.position = position;
      this.avalavleUnits = avalableUnits;
    }

    hire(unit:string){
      if(this.avalableUnits.includes(unit)){
        console.log(`Найнято ${unit} у замку (${this.position.x}, ${this.position.y}).`);
      } else {
        console.log(`Юніт недоступний в цьому замку.`);
      }
    }

    activate():void{
      console.log(`Замок (${this.position.x}, ${this.position.y}) готовий //до чогось там`);
    }
    info():string{
      retutn `${this.name} at (${this.position.x}, ${this.position.y})`;
    }
  };

  static Village = class implements IBuilding {
    name:string;
    position:{x:number; y:number};
    goldTurn: number;
    healTurn: number;

    constructor(position:{x:number; y:number}, goldTurn=10, healTurn=5{
      this.name="Village";
      this.position = position;
      this.goldTurn = goldTurn;
      this.healTurn = healTurn;
    }

    activate(): void{
      console.log(`Село (${this.position.x}, ${this.position.y}) приносить ${this.goldTurn} золота і лікує на ${this.healTurn} HP`);
    };
    info():string{
      return `${this.name} at (${this.position.x}, ${this.position.y})`;
    }
  };
}

const castle = new Building.Castle({x:2, y:3});
const village = new Building.Village({x:5, y:1}, 20, 8);
castel.activate();
castle.hire("//назва класу персонажів");
village.activate();
console.log(castle.info());
console.log(village.info());
