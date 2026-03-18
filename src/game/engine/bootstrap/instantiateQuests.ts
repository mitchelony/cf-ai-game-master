import type { ID } from "../../../lib/types/common";
import type { QuestState } from "../../schemas/quests";
import { QUEST_TEMPLATES } from "../../templates/quests";

export function instantiateQuests(): Record<ID, QuestState> {
  return Object.fromEntries(
    QUEST_TEMPLATES.map((template) => [
      template.id,
      {
        id: template.id,
        title: template.title,
        description: template.description,
        stages: template.stages,
        currentStage: 0,
        status: "inactive",
        rewards: template.rewards,
        failConditions: template.failConditions,
      },
    ]),
  ) as Record<ID, QuestState>;
}
