export type ID = string;
export type ISODateString = string;

export type Rarity = "common" | "uncommon" | "rare" | "epic";

export type Mood = "calm" | "tense" | "hostile" | "fearful" | "hopeful";

export type Faction = "pilgrims" | "wardens" | "scavengers" | "unknown";

export interface RangeBound {
  min: number;
  max: number;
}

export interface StatBlock {
  health: number;
  stamina: number;
  power: number;
  defense: number;
}
