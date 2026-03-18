import type { Action } from "../game/schemas/actions";
import type { PlayerArchetype } from "../game/schemas/player";
import type { TurnResponse } from "../game/schemas/response";
import type { SessionState } from "../game/schemas/session";
import { buildSession } from "../game/engine/bootstrap/buildSession";
import { getCurrentState } from "./tools/getCurrentState";
import { resolveAction } from "./tools/resolveAction";
import { saveCheckpoint } from "./tools/saveCheckpoint";

export type StartSessionOptions = {
  playerName?: string;
  playerArchetype?: PlayerArchetype;
};

export type AgentTurnResult =
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

export class GameMasterAgent {
  private session: SessionState | null = null;

  startSession(options: StartSessionOptions = {}): SessionState {
    this.session = buildSession({
      playerName: options.playerName,
      playerArchetype: options.playerArchetype,
    });

    return this.session;
  }

  getState(): SessionState | null {
    return getCurrentState(this.session);
  }

  ensureSession(): SessionState {
    if (!this.session) {
      this.session = buildSession({
        playerName: "Traveler",
        playerArchetype: "rogue",
      });
    }

    return this.session;
  }

  runTurn(action: Action): AgentTurnResult {
    const session = this.ensureSession();
    const result = resolveAction(session, action);

    if (!result.ok) {
      return result;
    }

    this.session = saveCheckpoint(result.session);

    return {
      ok: true,
      session: this.session,
      response: result.response,
    };
  }

  resetSession(options: StartSessionOptions = {}): SessionState {
    return this.startSession(options);
  }
}
