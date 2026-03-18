import type { SessionState } from "../../game/schemas/session";

export function saveCheckpoint(session: SessionState): SessionState {
  return {
    ...session,
  };
}
