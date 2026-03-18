import type { Faction, ID } from "../../lib/types/common";

export type NpcRole =
  | "merchant"
  | "guard"
  | "noble"
  | "criminal"
  | "scholar"
  | "healer"
  | "quest_giver"
  | "villager"
  | "custom";

export type DialogueStyle =
  | "formal"
  | "casual"
  | "cryptic"
  | "friendly"
  | "hostile"
  | "sarcastic"
  | "reserved"
  | "custom";

export type NpcTemplate = {
  id: ID;
  role: NpcRole;
  faction: Faction;
  temperament: string;
  motivePool: string[];
  secretPool: string[];
  dialogueStyle: DialogueStyle;
};

export type NpcArchetype = NpcTemplate;

export type NpcState = {
  id: ID;
  archetypeId: ID;
  name: string;
  role: NpcRole;
  faction: Faction;
  trust: number;
  suspicion: number;
  currentLocationId: ID;
  isAlive: boolean;
  knownSecrets: string[];
  dialogueStyle: DialogueStyle;
};

export type Npc = NpcState;
