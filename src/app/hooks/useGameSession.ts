import { useMemo, useState } from "react";
import type { Action } from "../../game/schemas/actions";
import type { NpcRole } from "../../game/schemas/npc";
import type { TurnResponse } from "../../game/schemas/response";
import type { SessionState } from "../../game/schemas/session";
import { buildSession } from "../../game/engine/bootstrap/buildSession";
import { runTurn } from "../../game/engine/turn/turnLoop";
import { ITEM_TEMPLATES } from "../../game/templates/items";

type UseGameSessionResult = {
  session: SessionState;
  lastResponse: TurnResponse | null;
  error: string | null;
  availableMoves: Array<{ id: string; name: string }>;
  visibleNpcs: Array<{ id: string; name: string; role: NpcRole }>;
  inventoryItems: Array<{ id: string; name: string; rarity: string }>;
  performAction: (action: Action) => void;
  resetSession: () => void;
};

function createInitialSession() {
  return buildSession({
    playerName: "Mitchel",
    playerArchetype: "rogue",
  });
}

export function useGameSession(): UseGameSessionResult {
  const [session, setSession] = useState<SessionState>(() => createInitialSession());
  const [lastResponse, setLastResponse] = useState<TurnResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentLocation = session.world.locations[session.player.locationId];

  const availableMoves = useMemo(() => {
    if (!currentLocation) return [];

    return currentLocation.connectedLocationIds
      .map((locationId) => {
        const location = session.world.locations[locationId];
        if (!location) return null;

        return {
          id: location.id,
          name: location.name,
        };
      })
      .filter((value): value is { id: string; name: string } => value !== null);
  }, [currentLocation, session.world.locations]);

  const visibleNpcs = useMemo(() => {
    if (!currentLocation) return [];

    return currentLocation.visibleNpcIds
      .map((npcId) => {
        const npc = session.npcs[npcId];
        if (!npc) return null;

        return {
          id: npc.id,
          name: npc.name,
          role: npc.role,
        };
      })
      .filter(
        (value): value is { id: string; name: string; role: NpcRole } =>
          value !== null,
      );
  }, [currentLocation, session.npcs]);

  const inventoryItems = useMemo(() => {
    return session.player.inventoryItemIds.map((itemId) => {
      const template = ITEM_TEMPLATES.find((item) => item.id === itemId);

      return {
        id: itemId,
        name: template?.name ?? itemId,
        rarity: template?.rarity ?? "unknown",
      };
    });
  }, [session.player.inventoryItemIds]);

  function performAction(action: Action) {
    setError(null);

    const result = runTurn(session, action);

    if (!result.ok) {
      setLastResponse(result.response);
      setError(result.reason);
      return;
    }

    setSession(result.session);
    setLastResponse(result.response);
  }

  function resetSession() {
    setSession(createInitialSession());
    setLastResponse(null);
    setError(null);
  }

  return {
    session,
    lastResponse,
    error,
    availableMoves,
    visibleNpcs,
    inventoryItems,
    performAction,
    resetSession,
  };
}
