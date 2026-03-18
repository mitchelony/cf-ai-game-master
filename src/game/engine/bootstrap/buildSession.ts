import type { ID } from "../../../lib/types/common";
import type {
  PlayerArchetype,
  PlayerConditionFlags,
  PlayerState,
  PlayerStats,
} from "../../schemas/player";
import type { SessionEvent, SessionState } from "../../schemas/session";
import { createId, createIsoTimestamp } from "../utils/ids";
import { instantiateNpcs } from "./instantiateNpcs";
import { instantiateQuests } from "./instantiateQuests";
import { instantiateRegion } from "./instantiateRegion";

export type BuildSessionOptions = {
  playerName?: string;
  playerArchetype?: PlayerArchetype;
  regionId?: ID;
};

const BASE_PLAYER_STATS: Record<PlayerArchetype, PlayerStats> = {
  warrior: {
    health: 120,
    maxHealth: 120,
    stamina: 80,
    maxStamina: 80,
    mana: 10,
    maxMana: 10,
    strength: 14,
    agility: 8,
    intellect: 6,
    defense: 12,
    speed: 8,
    level: 1,
    xp: 0,
  },
  rogue: {
    health: 90,
    maxHealth: 90,
    stamina: 100,
    maxStamina: 100,
    mana: 20,
    maxMana: 20,
    strength: 9,
    agility: 14,
    intellect: 9,
    defense: 8,
    speed: 14,
    level: 1,
    xp: 0,
  },
  mage: {
    health: 70,
    maxHealth: 70,
    stamina: 50,
    maxStamina: 50,
    mana: 120,
    maxMana: 120,
    strength: 5,
    agility: 8,
    intellect: 16,
    defense: 6,
    speed: 9,
    level: 1,
    xp: 0,
  },
  ranger: {
    health: 95,
    maxHealth: 95,
    stamina: 90,
    maxStamina: 90,
    mana: 30,
    maxMana: 30,
    strength: 10,
    agility: 13,
    intellect: 8,
    defense: 9,
    speed: 12,
    level: 1,
    xp: 0,
  },
  cleric: {
    health: 85,
    maxHealth: 85,
    stamina: 70,
    maxStamina: 70,
    mana: 90,
    maxMana: 90,
    strength: 7,
    agility: 7,
    intellect: 13,
    defense: 10,
    speed: 8,
    level: 1,
    xp: 0,
  },
  custom: {
    health: 100,
    maxHealth: 100,
    stamina: 75,
    maxStamina: 75,
    mana: 50,
    maxMana: 50,
    strength: 10,
    agility: 10,
    intellect: 10,
    defense: 10,
    speed: 10,
    level: 1,
    xp: 0,
  },
};

const DEFAULT_CONDITION_FLAGS: PlayerConditionFlags = {
  isAlive: true,
  isInCombat: false,
  isHidden: false,
  isEncumbered: false,
  isPoisoned: false,
  isStunned: false,
  isBleeding: false,
};

const STARTING_INVENTORY_BY_ARCHETYPE: Record<PlayerArchetype, ID[]> = {
  warrior: ["item_salt_worn_dagger", "item_ration_pack"],
  rogue: ["item_salt_worn_dagger", "item_smuggler_map_scrap"],
  mage: ["item_rusted_charm", "item_healing_tonic"],
  ranger: ["item_signal_flare", "item_ration_pack"],
  cleric: ["item_healing_tonic", "item_rusted_charm"],
  custom: ["item_ration_pack"],
};

function buildPlayerState(
  name: string,
  archetype: PlayerArchetype,
  startingLocationId: ID,
): PlayerState {
  return {
    id: createId("player"),
    name,
    archetype,
    stats: { ...BASE_PLAYER_STATS[archetype] },
    inventoryItemIds: [...STARTING_INVENTORY_BY_ARCHETYPE[archetype]],
    locationId: startingLocationId,
    reputation: 0,
    conditionFlags: { ...DEFAULT_CONDITION_FLAGS },
  };
}

function buildInitialEventLog(
  playerName: string,
  regionName: string,
  startingLocationName: string,
): SessionEvent[] {
  const timestamp = createIsoTimestamp();

  return [
    {
      id: createId("event"),
      turn: 0,
      timestamp,
      type: "system",
      message: `Session created for ${playerName}.`,
      metadata: {
        phase: "bootstrap",
      },
    },
    {
      id: createId("event"),
      turn: 0,
      timestamp,
      type: "narrative",
      message: `${playerName} arrives in ${regionName}, beginning at ${startingLocationName}.`,
      metadata: {
        introPending: true,
      },
    },
  ];
}

export function buildSession(
  options: BuildSessionOptions = {},
): SessionState {
  const playerName = options.playerName?.trim() || "Traveler";
  const playerArchetype = options.playerArchetype ?? "rogue";

  const regionResult = instantiateRegion(options.regionId);
  const npcResult = instantiateNpcs(
    regionResult.regionTemplate.id,
    regionResult.world.locations,
  );
  const quests = instantiateQuests();

  const world = {
    ...regionResult.world,
    locations: npcResult.locations,
  };

  const player = buildPlayerState(
    playerName,
    playerArchetype,
    regionResult.startingLocationId,
  );

  const startingLocation = world.locations[regionResult.startingLocationId];

  if (!startingLocation) {
    throw new Error(
      `Starting location missing from world state: ${regionResult.startingLocationId}`,
    );
  }

  return {
    sessionId: createId("session"),
    createdAt: createIsoTimestamp(),
    player,
    world,
    npcs: npcResult.npcs,
    quests,
    currentTurn: 0,
    eventLog: buildInitialEventLog(
      playerName,
      regionResult.regionTemplate.name,
      startingLocation.name,
    ),
  };
}
