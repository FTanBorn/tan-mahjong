// types/gameTypes.ts

// Takım türlerini tanımla
export const TEAMS = {
  UNDEFINED: "undefined",
  ANIMAL: "animal",
  SOCIAL: "social",
} as const;

export type TeamType = (typeof TEAMS)[keyof typeof TEAMS];

// Taş tipi tanımlaması
export interface Tile {
  type: string;
  value: string;
  isVisible: boolean;
  tileType: string;
  isCollected?: boolean;
}

// Oyuncu tipi tanımlaması
export interface Player {
  name: string;
  canPlay: boolean;
  team: string;
  lastTileTeam: string;
  collectedTiles: Tile[];
}

// Oyun aşamalarını tanımlayan tip
export type GamePhase = "teamSelection" | "gameplay";

// Hamle referansı için tip
export interface MoveReference {
  matrix: Tile[][] | null;
  playerIndex: number;
  completed: boolean;
}

// Aktif taş için tip
export interface ActiveTile {
  row: number;
  matrix: number;
}
