import type { Action } from "../../game/schemas/actions";
import type { SessionState } from "../../game/schemas/session";
import { runTurn } from "../../game/engine/turn/turnLoop";

export function resolveAction(session: SessionState, action: Action) {
  return runTurn(session, action);
}
