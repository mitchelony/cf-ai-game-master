import type { QuestTemplate } from "../schemas/quests";

export const QUEST_TEMPLATES: QuestTemplate[] = [
  {
    id: "quest_salt_ledger",
    title: "The Salt Ledger",
    description: "Recover a stolen ledger tied to black-market trade.",
    trigger: "player_enters_loc_black_tide_market",
    stages: [
      {
        id: "stage_trace_ledger",
        title: "Trace the Ledger",
        description: "Find out who last handled the contraband ledger.",
        objectives: ["question_merchant", "search_harbor_crates"],
      },
      {
        id: "stage_recover_ledger",
        title: "Recover the Ledger",
        description: "Retrieve the ledger from the tunnel network.",
        objectives: ["enter_smuggler_tunnel", "secure_ledger"],
      },
      {
        id: "stage_choose_recipient",
        title: "Choose a Recipient",
        description: "Decide who gets the recovered evidence.",
        objectives: ["give_to_wardens_or_market"],
      },
    ],
    branchOutcomes: [
      {
        id: "branch_turn_over_wardens",
        summary: "Trade routes stabilize but underground allies turn hostile.",
      },
      {
        id: "branch_return_to_market",
        summary: "Market influence grows and Warden patrol pressure increases.",
      },
    ],
    rewards: {
      xp: 200,
      gold: 120,
      itemIds: ["item_healing_tonic"],
      reputation: 2,
    },
    failConditions: [
      {
        id: "fail_ledger_destroyed",
        description: "The contraband ledger is destroyed before recovery.",
      },
    ],
    worldImpacts: [
      {
        id: "impact_patrol_intensity_shift",
        description: "Warden patrol checks become more frequent or more relaxed.",
      },
      {
        id: "impact_market_prices_shift",
        description: "Black-Tide market prices drop or rise based on outcome.",
      },
    ],
  },
  {
    id: "quest_ashes_in_the_chapel",
    title: "Ashes in the Chapel",
    description:
      "Investigate strange rites in the Salt Chapel and choose to expose or protect them.",
    trigger: "player_inspects_loc_salt_chapel_altar",
    stages: [
      {
        id: "stage_investigate_rites",
        title: "Investigate the Rites",
        description: "Collect testimony and signs from the chapel grounds.",
        objectives: ["inspect_chapel", "speak_with_keeper"],
      },
      {
        id: "stage_verify_claims",
        title: "Verify the Claims",
        description: "Cross-check the rites against records and witnesses.",
        objectives: ["consult_exiled_warden", "find_hidden_relic"],
      },
      {
        id: "stage_final_judgment",
        title: "Final Judgment",
        description: "Expose the rites publicly or protect the chapel secret.",
        objectives: ["choose_expose_or_protect"],
      },
    ],
    branchOutcomes: [
      {
        id: "branch_expose_rites",
        summary: "Public trust in pilgrims falls; wardens gain leverage.",
      },
      {
        id: "branch_protect_rites",
        summary: "Pilgrims protect you; rumors spread that you hide dangerous truths.",
      },
    ],
    rewards: {
      xp: 180,
      itemIds: ["item_chapel_key", "item_rusted_charm"],
      reputation: 1,
    },
    failConditions: [
      {
        id: "fail_keeper_slain",
        description: "The shrine keeper dies before testimony is resolved.",
      },
    ],
    worldImpacts: [
      {
        id: "impact_pilgrim_trust_shift",
        description: "Pilgrim cooperation with outsiders increases or collapses.",
      },
      {
        id: "impact_chapel_access_change",
        description:
          "Restricted chapel areas become accessible or permanently sealed.",
      },
    ],
  },
];
