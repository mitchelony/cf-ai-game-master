import type { Action } from "../../schemas/actions";
import type { StateChange } from "../../schemas/response";
import type { SessionState } from "../../schemas/session";

export type ResolutionResult = {
  stateChanges: StateChange[];
  summary: string;
  details?: Record<string, unknown>;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getCurrentLocation(session: SessionState) {
  return session.world.locations[session.player.locationId];
}

export function resolveAction(
  session: SessionState,
  action: Action,
): ResolutionResult {
  const currentLocation = getCurrentLocation(session);

  if (!currentLocation) {
    throw new Error("Current location not found during action resolution.");
  }

  switch (action.type) {
    case "move": {
      const destination = session.world.locations[action.destinationId];

      if (!destination) {
        throw new Error(`Destination not found: ${action.destinationId}`);
      }

      const destinationWasDiscovered = session.world.discoveredLocationIds.includes(
        destination.id,
      );

      const stateChanges: StateChange[] = [
        {
          path: "player.locationId",
          before: session.player.locationId,
          after: destination.id,
          reason: "Player moved to a connected location.",
        },
      ];

      if (!destinationWasDiscovered) {
        stateChanges.push({
          path: "world.discoveredLocationIds",
          before: [...session.world.discoveredLocationIds],
          after: [...session.world.discoveredLocationIds, destination.id],
          reason: "Player discovered a new location.",
        });

        stateChanges.push({
          path: `world.locations.${destination.id}.discovered`,
          before: false,
          after: true,
          reason: "Location marked as discovered.",
        });
      }

      stateChanges.push({
        path: "world.worldFlags.firstMoveTaken",
        before: session.world.worldFlags.firstMoveTaken,
        after: true,
        reason: "Player completed the first move.",
      });

      return {
        stateChanges,
        summary: `You move to ${destination.name}.`,
        details: {
          locationId: destination.id,
          locationName: destination.name,
          newlyDiscovered: !destinationWasDiscovered,
        },
      };
    }

    case "inspect": {
      return {
        stateChanges: [],
        summary: action.target
          ? `You inspect ${action.target}.`
          : `You take a careful look around ${currentLocation.name}.`,
        details: {
          locationId: currentLocation.id,
          visibleNpcIds: [...currentLocation.visibleNpcIds],
          availableItemIds: [...currentLocation.availableItemIds],
        },
      };
    }

    case "talk": {
      const npc = session.npcs[action.targetNpcId];

      if (!npc) {
        throw new Error(`NPC not found: ${action.targetNpcId}`);
      }

      return {
        stateChanges: [],
        summary: action.topic
          ? `You speak with ${npc.name} about ${action.topic}.`
          : `You speak with ${npc.name}.`,
        details: {
          npcId: npc.id,
          npcName: npc.name,
          topic: action.topic ?? null,
        },
      };
    }

    case "rest": {
      const currentHealth = session.player.stats.health;
      const currentStamina = session.player.stats.stamina;

      const nextHealth = clamp(
        currentHealth + 10,
        0,
        session.player.stats.maxHealth,
      );
      const nextStamina = clamp(
        currentStamina + 15,
        0,
        session.player.stats.maxStamina,
      );

      const stateChanges: StateChange[] = [];

      if (nextHealth !== currentHealth) {
        stateChanges.push({
          path: "player.stats.health",
          before: currentHealth,
          after: nextHealth,
          reason: "Player recovered health while resting.",
        });
      }

      if (nextStamina !== currentStamina) {
        stateChanges.push({
          path: "player.stats.stamina",
          before: currentStamina,
          after: nextStamina,
          reason: "Player recovered stamina while resting.",
        });
      }

      return {
        stateChanges,
        summary:
          stateChanges.length > 0
            ? "You take a moment to rest and recover."
            : "You pause to rest, but you are already fully recovered.",
        details: {
          recoveredHealth: nextHealth - currentHealth,
          recoveredStamina: nextStamina - currentStamina,
        },
      };
    }

    case "meta": {
      if (action.command === "status") {
        return {
          stateChanges: [],
          summary: [
            `${session.player.name} the ${session.player.archetype}`,
            `Health: ${session.player.stats.health}/${session.player.stats.maxHealth}`,
            `Stamina: ${session.player.stats.stamina}/${session.player.stats.maxStamina}`,
            `Location: ${currentLocation.name}`,
            `Turn: ${session.currentTurn}`,
            `Visible NPCs: ${currentLocation.visibleNpcIds.length}`,
            `Connected paths: ${currentLocation.connectedLocationIds.length}`,
          ].join(" · "),
          details: {
            command: action.command,
            locationId: currentLocation.id,
            visibleNpcCount: currentLocation.visibleNpcIds.length,
            connectedLocationCount: currentLocation.connectedLocationIds.length,
          },
        };
      }

      if (action.command === "recap") {
        const recentEvents = session.eventLog
          .slice(-3)
          .map((event) => event.message);

        return {
          stateChanges: [],
          summary:
            recentEvents.length > 0
              ? `Recent events: ${recentEvents.join(" | ")}`
              : "No notable events yet.",
          details: {
            command: action.command,
            eventCount: session.eventLog.length,
          },
        };
      }

      return {
        stateChanges: [],
        summary:
          "Available commands: inspect, rest, status, recap, move to a connected location, or talk to a visible NPC.",
        details: {
          command: action.command,
        },
      };
    }

    case "take":
    case "use":
    case "attack":
      throw new Error(`${action.type} is not implemented yet.`);

    default:
      throw new Error("Unknown action type during resolution.");
  }
}
