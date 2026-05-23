export class UnitSpriteMapper {
  private static readonly spriteMap: Record<string, string> = {
    soldier: "/sprites/soldier.png",
    archer: "/sprites/archer.png",
    lizard: "/sprites/lizard.png",
    wizard: "/sprites/wizard.png",
    knight: "/sprites/knight.png",
    golem: "/sprites/golem.png",
  };

  static getSprite(unitId: string): string {
    const sprite = this.spriteMap[unitId];
    if (!sprite) {
      throw new Error(`No sprite found for unit type: ${unitId}`);
    }
    return sprite;
  }

  static getSpriteOrDefault(unitId: string, fallback: string = "/sprites/default.png"): string {
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
