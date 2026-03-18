import type { StateChange } from "../../schemas/response";
import type { SessionState } from "../../schemas/session";

function cloneSession(session: SessionState): SessionState {
  return {
    ...session,
    player: {
      ...session.player,
      stats: { ...session.player.stats },
      inventoryItemIds: [...session.player.inventoryItemIds],
      conditionFlags: { ...session.player.conditionFlags },
    },
    world: {
      ...session.world,
      worldVariables: { ...session.world.worldVariables },
      regionState: Object.fromEntries(
        Object.entries(session.world.regionState).map(([id, region]) => [
          id,
          {
            ...region,
            flags: { ...region.flags },
          },
        ]),
      ),
      locations: Object.fromEntries(
        Object.entries(session.world.locations).map(([id, location]) => [
          id,
          {
            ...location,
            connectedLocationIds: [...location.connectedLocationIds],
            visibleNpcIds: [...location.visibleNpcIds],
            availableItemIds: [...location.availableItemIds],
          },
        ]),
      ),
      discoveredLocationIds: [...session.world.discoveredLocationIds],
      activeEncounters: session.world.activeEncounters.map((encounter) => ({
        ...encounter,
        participantIds: [...encounter.participantIds],
        flags: { ...encounter.flags },
      })),
      worldFlags: { ...session.world.worldFlags },
    },
    npcs: Object.fromEntries(
      Object.entries(session.npcs).map(([id, npc]) => [
        id,
        {
          ...npc,
          knownSecrets: [...npc.knownSecrets],
        },
      ]),
    ),
    quests: Object.fromEntries(
      Object.entries(session.quests).map(([id, quest]) => [
        id,
        {
          ...quest,
          stages: quest.stages.map((stage) => ({
            ...stage,
            objectives: [...stage.objectives],
          })),
          rewards: {
            ...quest.rewards,
            itemIds: quest.rewards.itemIds ? [...quest.rewards.itemIds] : undefined,
          },
          failConditions: quest.failConditions.map((condition) => ({
            ...condition,
          })),
        },
      ]),
    ),
    eventLog: [...session.eventLog],
  };
}

export function applyStateChanges(
  session: SessionState,
  stateChanges: StateChange[],
): SessionState {
  const nextSession = cloneSession(session);

  for (const change of stateChanges) {
    switch (change.path) {
      case "player.locationId":
        nextSession.player.locationId = change.after as string;
        break;

      case "player.stats.health":
        nextSession.player.stats.health = change.after as number;
        break;

      case "player.stats.stamina":
        nextSession.player.stats.stamina = change.after as number;
        break;

      case "world.discoveredLocationIds":
        nextSession.world.discoveredLocationIds = change.after as string[];
        break;

      case "world.worldFlags.firstMoveTaken":
        nextSession.world.worldFlags.firstMoveTaken = change.after as boolean;
        break;

      default: {
        if (change.path.startsWith("world.locations.") && change.path.endsWith(".discovered")) {
          const locationId = change.path.split(".")[2];
          const location = nextSession.world.locations[locationId];

          if (location) {
            location.discovered = change.after as boolean;
          }
        }
        break;
      }
    }
  }

  return nextSession;
}
