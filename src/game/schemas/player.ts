export type PlayerArchetype =
  | "warrior"
  | "rogue"
  | "mage"
  | "ranger"
  | "cleric"
  | "custom";

export type PlayerStats = {
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  mana: number;
  maxMana: number;
  strength: number;
  agility: number;
  intellect: number;
  defense: number;
  speed: number;
  level: number;
  xp: number;
};

export type PlayerConditionFlags = {
  isAlive: boolean;
  isInCombat: boolean;
  isHidden: boolean;
  isEncumbered: boolean;
  isPoisoned: boolean;
  isStunned: boolean;
  isBleeding: boolean;
};

export type PlayerTemplate = {
  id: string;
  name: string;
  archetype: PlayerArchetype;
  baseStats: PlayerStats;
  startingInventoryItemIds: string[];
  startingLocationId: string;
  baseReputation: number;
  defaultConditionFlags: PlayerConditionFlags;
};

export type PlayerState = {
  id: string;
  name: string;
  archetype: PlayerArchetype;
  stats: PlayerStats;
  inventoryItemIds: string[];
  locationId: string;
  reputation: number;
  conditionFlags: PlayerConditionFlags;
};

export type Player = PlayerState;
