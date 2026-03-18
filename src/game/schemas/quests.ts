import type { ID } from "../../lib/types/common";

export type QuestStatus = "inactive" | "active" | "completed" | "failed";

export type QuestStage = {
  id: ID;
  title: string;
  description: string;
  objectives: ID[];
};

export type QuestReward = {
  xp?: number;
  gold?: number;
  itemIds?: ID[];
  reputation?: number;
};

export type QuestFailCondition = {
  id: ID;
  description: string;
};

export type QuestBranchOutcome = {
  id: ID;
  summary: string;
};

export type QuestWorldImpact = {
  id: ID;
  description: string;
};

export type QuestTemplate = {
  id: ID;
  title: string;
  description: string;
  trigger: ID;
  stages: QuestStage[];
  branchOutcomes: QuestBranchOutcome[];
  rewards: QuestReward;
  failConditions: QuestFailCondition[];
  worldImpacts: QuestWorldImpact[];
};

export type QuestState = {
  id: ID;
  title: string;
  description: string;
  stages: QuestStage[];
  currentStage: number;
  status: QuestStatus;
  rewards: QuestReward;
  failConditions: QuestFailCondition[];
};

export type Quest = QuestState;
