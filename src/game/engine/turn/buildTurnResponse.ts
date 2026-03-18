import type { Action } from "../../schemas/actions";
import type {
  QuestUpdate,
  StatUpdate,
  SuggestedAction,
  TurnResponse,
} from "../../schemas/response";
import type { SessionState } from "../../schemas/session";
import type { ResolutionResult } from "./resolveAction";

function buildStatUpdates(
  previousSession: SessionState,
  nextSession: SessionState,
): StatUpdate[] {
  const updates: StatUpdate[] = [];

  const trackedStats: Array<keyof SessionState["player"]["stats"]> = [
    "health",
    "stamina",
  ];

  for (const stat of trackedStats) {
    const before = previousSession.player.stats[stat];
    const after = nextSession.player.stats[stat];

    if (before !== after) {
      updates.push({
        stat,
        delta: after - before,
        nextValue: after,
      });
    }
  }

  return updates;
}

function buildSuggestedActions(
  nextSession: SessionState,
  action: Action,
): SuggestedAction[] {
  const currentLocation = nextSession.world.locations[nextSession.player.locationId];

  if (!currentLocation) {
    return [];
  }

  switch (action.type) {
    case "move":
      return [
        { type: "inspect", label: "Inspect the area", hint: "Look around your new surroundings." },
        ...currentLocation.visibleNpcIds.slice(0, 2).map((npcId) => ({
          type: "talk" as const,
          label: `Talk to ${nextSession.npcs[npcId]?.name ?? "nearby figure"}`,
          hint: "Start a conversation.",
        })),
        { type: "rest", label: "Rest briefly", hint: "Recover a little before moving on." },
      ];

    case "inspect":
      return [
        ...currentLocation.connectedLocationIds.slice(0, 2).map((locationId) => ({
          type: "move" as const,
          label: `Travel to ${nextSession.world.locations[locationId]?.name ?? "another area"}`,
          hint: "Move to a connected location.",
        })),
        ...currentLocation.visibleNpcIds.slice(0, 1).map((npcId) => ({
          type: "talk" as const,
          label: `Talk to ${nextSession.npcs[npcId]?.name ?? "nearby figure"}`,
          hint: "Ask questions or gather information.",
        })),
      ];

    case "talk":
      return [
        { type: "inspect", label: "Inspect the area", hint: "Look for clues nearby." },
        { type: "meta", label: "Check status", hint: "Review your condition and progress." },
      ];

    case "rest":
      return [
        { type: "inspect", label: "Inspect the area", hint: "Reassess your surroundings." },
        ...currentLocation.connectedLocationIds.slice(0, 1).map((locationId) => ({
          type: "move" as const,
          label: `Move to ${nextSession.world.locations[locationId]?.name ?? "another area"}`,
          hint: "Continue exploring.",
        })),
      ];

    case "meta":
      return [
        { type: "inspect", label: "Inspect the area", hint: "Return to the world around you." },
        ...currentLocation.connectedLocationIds.slice(0, 1).map((locationId) => ({
          type: "move" as const,
          label: `Move to ${nextSession.world.locations[locationId]?.name ?? "another area"}`,
          hint: "Continue exploring.",
        })),
      ];

    default:
      return [];
  }
}

export function buildTurnResponse(
  previousSession: SessionState,
  nextSession: SessionState,
  action: Action,
  resolution: ResolutionResult,
): TurnResponse {
  const questUpdates: QuestUpdate[] = [];
  const statUpdates = buildStatUpdates(previousSession, nextSession);
  const suggestedActions = buildSuggestedActions(nextSession, action);

  return {
    narrativeText: resolution.summary,
    stateChanges: resolution.stateChanges,
    questUpdates,
    statUpdates,
    suggestedActions,
  };
}
