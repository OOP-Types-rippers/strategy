export class UnitSpriteMapper {
  private static readonly spriteMap: Record<string, string> = {
    soldier: "../entities/sprites/soldier.png",
    archer: "../entities/sprites/archer.png",
    lizard: "../entities/sprites/lizard.png",
    wizard: "../entities/sprites/wizard.png",
    knight: "../entities/sprites/knight.png",
    golem: "../entities/sprites/golem.png",
  };

  static getSprite(unitId: string): string {
    return this.spriteMap[unitId] ?? "../entities/sprites/not-found.png";
  }

  static getSpriteOrDefault(unitId: string, fallback: string = "../entities/sprites/default.png"): string {
    return this.spriteMap[unitId] ?? fallback;
  }

  static hasSprite(unitId: string): boolean {
    return unitId in this.spriteMap;
  }

  static getAllSprites(): Record<string, string> {
    return { ...this.spriteMap };
  }

  static registerSprite(unitId: string, spritePath: string): void {
    this.spriteMap[unitId] = spritePath;
  }

  static registerSprites(sprites: Record<string, string>): void {
    Object.assign(this.spriteMap, sprites);
  }
}
