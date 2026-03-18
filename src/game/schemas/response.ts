import type { ActionType } from "./actions";
import type { QuestStatus } from "./quests";

export type StateChange = {
  path: string;
  before?: unknown;
  after?: unknown;
  reason?: string;
};

export type QuestUpdate = {
  questId: string;
  previousStatus?: QuestStatus;
  status: QuestStatus;
  previousStage?: number;
  currentStage?: number;
  note?: string;
};

export type StatUpdate = {
  stat: string;
  delta: number;
  nextValue: number;
};

export type SuggestedAction = {
  type: ActionType;
  label: string;
  hint?: string;
};

export type TurnResponse = {
  narrativeText: string;
  stateChanges: StateChange[];
  questUpdates: QuestUpdate[];
  statUpdates: StatUpdate[];
  suggestedActions: SuggestedAction[];
};

export type EngineResponse = TurnResponse;
