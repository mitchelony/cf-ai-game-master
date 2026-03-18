import type { SessionState } from "../../game/schemas/session";

export function getCurrentState(session: SessionState | null): SessionState | null {
  return session;
}
