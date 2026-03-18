import type { Action } from "../../schemas/actions";
import type { SessionState } from "../../schemas/session";
import { canRestInZone } from "../../constraints/worldRules";

export type ActionValidationResult =
  | { ok: true }
  | { ok: false; reason: string };

function getCurrentLocation(session: SessionState) {
  return session.world.locations[session.player.locationId];
}

export function validateAction(
  session: SessionState,
  action: Action,
): ActionValidationResult {
  const currentLocation = getCurrentLocation(session);

  if (!currentLocation) {
    return {
      ok: false,
      reason: "Your current location could not be found.",
    };
  }

  switch (action.type) {
    case "move": {
      const destination = session.world.locations[action.destinationId];

      if (!destination) {
        return {
          ok: false,
          reason: "That destination does not exist.",
        };
      }

      const isConnected = currentLocation.connectedLocationIds.includes(
        action.destinationId,
      );

      if (!isConnected) {
        return {
          ok: false,
          reason: "You cannot move directly there from here.",
        };
      }

      return { ok: true };
    }

    case "inspect":
      return { ok: true };

    case "talk": {
      const npc = session.npcs[action.targetNpcId];

      if (!npc) {
        return {
          ok: false,
          reason: "That person is not here.",
        };
      }

      if (!npc.isAlive) {
        return {
          ok: false,
          reason: "You cannot speak to the dead. Grim stuff.",
        };
      }

      const isVisibleHere = currentLocation.visibleNpcIds.includes(
        action.targetNpcId,
      );

      if (!isVisibleHere || npc.currentLocationId !== currentLocation.id) {
        return {
          ok: false,
          reason: "That person is not available to talk here.",
        };
      }

      return { ok: true };
    }

    case "rest": {
      if (session.player.conditionFlags.isInCombat) {
        return {
          ok: false,
          reason: "You cannot rest while in combat.",
        };
      }

      const isHostileZone = currentLocation.dangerRating >= 4;
      const allowed = canRestInZone(isHostileZone);

      if (!allowed) {
        return {
          ok: false,
          reason: "This area is too dangerous to rest in.",
        };
      }

      return { ok: true };
    }

    case "meta":
      return { ok: true };

    case "take":
      return {
        ok: false,
        reason: "Take actions are not implemented yet.",
      };

    case "use":
      return {
        ok: false,
        reason: "Use actions are not implemented yet.",
      };

    case "attack":
      return {
        ok: false,
        reason: "Attack actions are not implemented yet.",
      };

    default:
      return {
        ok: false,
        reason: "Unknown action type.",
      };
  }
}
