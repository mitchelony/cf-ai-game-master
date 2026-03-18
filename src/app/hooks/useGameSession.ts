import { useAgent } from "agents/react";
import { useEffect, useMemo, useState } from "react";
import type { GameMasterAgent } from "../../agent/GameMasterAgent";
import type { GameMasterAgentState } from "../../agent/GameMasterAgent";
import { ITEM_TEMPLATES } from "../../game/templates/items";
import type { Action } from "../../game/schemas/actions";
import type { NpcRole } from "../../game/schemas/npc";
import type { TurnResponse } from "../../game/schemas/response";
import type { SessionState } from "../../game/schemas/session";

type UseGameSessionResult = {
  session: SessionState | null;
  lastResponse: TurnResponse | null;
  error: string | null;
  isReady: boolean;
  availableMoves: Array<{ id: string; name: string }>;
  visibleNpcs: Array<{ id: string; name: string; role: NpcRole }>;
  inventoryItems: Array<{ id: string; name: string; rarity: string }>;
  performAction: (action: Action) => Promise<void>;
  resetSession: () => Promise<void>;
};

const AGENT_INSTANCE_NAME = "mitchel-debug-session";

export function useGameSession(): UseGameSessionResult {
  const [session, setSession] = useState<SessionState | null>(null);
  const [lastResponse, setLastResponse] = useState<TurnResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const agent = useAgent<GameMasterAgent, GameMasterAgentState>({
    agent: "GameMasterAgent",
    name: AGENT_INSTANCE_NAME,
    onStateUpdate: (state) => {
      setSession(state.session ?? null);
    },
    onStateUpdateError: (message) => {
      setError(message);
    },
  });

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        setError(null);

        const existing = await agent.stub.getState();

        if (cancelled) return;

        if (existing) {
          setSession(existing);
          setIsReady(true);
          return;
        }

        const created = await agent.stub.startSession({
          playerName: "Mitchel",
          playerArchetype: "rogue",
        });

        if (cancelled) return;

        setSession(created);
        setIsReady(true);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to connect to agent.");
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [agent]);

  const currentLocation = session
    ? session.world.locations[session.player.locationId]
    : null;

  const availableMoves = useMemo(() => {
    if (!session || !currentLocation) return [];

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
  }, [currentLocation, session]);

  const visibleNpcs = useMemo(() => {
    if (!session || !currentLocation) return [];

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
  }, [currentLocation, session]);

  const inventoryItems = useMemo(() => {
    if (!session) return [];

    return session.player.inventoryItemIds.map((itemId) => {
      const template = ITEM_TEMPLATES.find((item) => item.id === itemId);

      return {
        id: itemId,
        name: template?.name ?? itemId,
        rarity: template?.rarity ?? "unknown",
      };
    });
  }, [session]);

  async function performAction(action: Action) {
    try {
      setError(null);

      const result = await agent.stub.runTurn(action);
      setLastResponse(result.response);

      if (!result.ok) {
        setError(result.reason);
        return;
      }

      setSession(result.session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run action.");
    }
  }

  async function resetSession() {
    try {
      setError(null);
      setLastResponse(null);

      const newSession = await agent.stub.resetSession({
        playerName: "Mitchel",
        playerArchetype: "rogue",
      });

      setSession(newSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset session.");
    }
  }

  return {
    session,
    lastResponse,
    error,
    isReady,
    availableMoves,
    visibleNpcs,
    inventoryItems,
    performAction,
    resetSession,
  };
}
