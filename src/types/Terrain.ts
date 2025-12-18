export type TerrainType = "road" | "grass" | "forest" | "hill" | "mountain" | "water";

export type TerrainStats = {
  [T in TerrainType]: {
    moveCost: number
    defenseBonus: number
  }
}
