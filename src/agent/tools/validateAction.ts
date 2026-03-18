import type { Action } from "../../game/schemas/actions";
import type { SessionState } from "../../game/schemas/session";
import { validateAction as validateGameAction } from "../../game/engine/turn/validateAction";

export function validateAction(session: SessionState, action: Action) {
  return validateGameAction(session, action);
}
