import type { NpcState } from "./npc";
import type { PlayerState } from "./player";
import type { QuestState } from "./quests";
import type { WorldState } from "./world";

export type SessionEventType =
  | "system"
  | "player_action"
  | "npc_action"
  | "quest_update"
  | "combat"
  | "narrative";

export type SessionEvent = {
  id: string;
  turn: number;
  timestamp: string;
  type: SessionEventType;
  message: string;
  metadata?: Record<string, string | number | boolean>;
};

export type SessionState = {
  sessionId: string;
  createdAt: string;
  player: PlayerState;
  world: WorldState;
  npcs: Record<string, NpcState>;
  quests: Record<string, QuestState>;
  currentTurn: number;
  eventLog: SessionEvent[];
};

export type Session = SessionState;
