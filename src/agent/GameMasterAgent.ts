import { Agent, callable } from "agents";
import type { Action } from "../game/schemas/actions";
import type { PlayerArchetype } from "../game/schemas/player";
import type { TurnResponse } from "../game/schemas/response";
import type { SessionState } from "../game/schemas/session";
import { buildSession } from "../game/engine/bootstrap/buildSession";
import { resolveAction } from "./tools/resolveAction";
import { saveCheckpoint } from "./tools/saveCheckpoint";

export type StartSessionOptions = {
  playerName?: string;
  playerArchetype?: PlayerArchetype;
};

export type GameMasterAgentState = {
  session: SessionState | null;
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

export class GameMasterAgent extends Agent<Env, GameMasterAgentState> {
  initialState: GameMasterAgentState = {
    session: null,
  };

  @callable()
  startSession(options: StartSessionOptions = {}): SessionState {
    const session = buildSession({
      playerName: options.playerName,
      playerArchetype: options.playerArchetype,
    });

    this.setState({
      session,
    });

    return session;
  }

  @callable()
  getState(): SessionState | null {
    return this.state.session;
  }

  ensureSession(): SessionState {
    if (!this.state.session) {
      const session = buildSession({
        playerName: "Traveler",
        playerArchetype: "rogue",
      });

      this.setState({
        session,
      });

      return session;
    }

    return this.state.session;
  }

  @callable()
  runTurn(action: Action): AgentTurnResult {
    const session = this.ensureSession();
    const result = resolveAction(session, action);

    if (!result.ok) {
      return result;
    }

    const savedSession = saveCheckpoint(result.session);

    this.setState({
      session: savedSession,
    });

    return {
      ok: true,
      session: savedSession,
      response: result.response,
    };
  }

  @callable()
  resetSession(options: StartSessionOptions = {}): SessionState {
    const session = buildSession({
      playerName: options.playerName,
      playerArchetype: options.playerArchetype,
    });

    this.setState({
      session,
    });

    return session;
  }
}
