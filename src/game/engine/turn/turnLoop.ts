import type { Action } from "../../schemas/actions";
import type { TurnResponse } from "../../schemas/response";
import type { SessionEvent, SessionState } from "../../schemas/session";
import { createId, createIsoTimestamp } from "../utils/ids";
import { applyStateChanges } from "./applyStateChanges";
import { buildTurnResponse } from "./buildTurnResponse";
import { interpretInput } from "./interpretInput";
import { resolveAction } from "./resolveAction";
import { validateAction } from "./validateAction";

export type RunTurnResult =
  | {
      ok: true;
      session: SessionState;
      response: TurnResponse;
    }
  | {
      ok: false;
      reason: string;
      response: TurnResponse;
    };

function shouldAdvanceTurn(action: Action): boolean {
  return action.type !== "meta";
}

function createEvent(
  turn: number,
  type: SessionEvent["type"],
  message: string,
  metadata?: Record<string, string | number | boolean>,
): SessionEvent {
  return {
    id: createId("event"),
    turn,
    timestamp: createIsoTimestamp(),
    type,
    message,
    metadata,
  };
}

function appendEvents(
  session: SessionState,
  events: SessionEvent[],
): SessionState {
  return {
    ...session,
    eventLog: [...session.eventLog, ...events],
  };
}

function buildFailureResponse(reason: string): TurnResponse {
  return {
    narrativeText: reason,
    stateChanges: [],
    questUpdates: [],
    statUpdates: [],
    suggestedActions: [
      {
        type: "inspect",
        label: "Inspect the area",
        hint: "Look around and reassess your options.",
      },
      {
        type: "meta",
        label: "Check status",
        hint: "Review your current situation.",
      },
    ],
  };
}

export function runTurn(
  session: SessionState,
  rawAction: Action,
): RunTurnResult {
  const action = interpretInput(rawAction);
  const validation = validateAction(session, action);

  if (!validation.ok) {
    const failedSession = appendEvents(session, [
      createEvent(
        session.currentTurn,
        "system",
        `Action rejected: ${action.type}`,
        {
          actionType: action.type,
          valid: false,
        },
      ),
    ]);
    void failedSession;

    return {
      ok: false,
      reason: validation.reason,
      response: buildFailureResponse(validation.reason),
    };
  }

  const actionTurn = shouldAdvanceTurn(action)
    ? session.currentTurn + 1
    : session.currentTurn;

  const actionEvent = createEvent(
    actionTurn,
    "player_action",
    `Player performed action: ${action.type}`,
    {
      actionType: action.type,
      valid: true,
    },
  );

  const resolution = resolveAction(session, action);
  let nextSession = applyStateChanges(session, resolution.stateChanges);

  nextSession = {
    ...nextSession,
    currentTurn: actionTurn,
  };

  const outcomeEvent = createEvent(
    actionTurn,
    action.type === "talk" ? "npc_action" : "narrative",
    resolution.summary,
    {
      actionType: action.type,
    },
  );

  nextSession = appendEvents(nextSession, [actionEvent, outcomeEvent]);

  const response = buildTurnResponse(session, nextSession, action, resolution);

  return {
    ok: true,
    session: nextSession,
    response,
  };
}
