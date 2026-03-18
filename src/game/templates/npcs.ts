import type { NpcTemplate } from "../schemas/npc";

export const NPC_TEMPLATES: NpcTemplate[] = [
  {
    id: "npc_arch_suspicious_merchant",
    role: "merchant",
    faction: "scavengers",
    temperament: "guarded",
    motivePool: ["protect_supply_lines", "maximize_profit", "avoid_patrols"],
    secretPool: [
      "sells_to_both_sides",
      "has_second_ledger_copy",
      "owes_debt_to_market_boss",
    ],
    dialogueStyle: "casual",
  },
  {
    id: "npc_arch_exiled_warden",
    role: "guard",
    faction: "wardens",
    temperament: "stern",
    motivePool: ["restore_honor", "control_violence", "hunt_smugglers"],
    secretPool: [
      "exiled_after_failed_raid",
      "still_contacts_old_captain",
      "hides_illegal_cache",
    ],
    dialogueStyle: "formal",
  },
  {
    id: "npc_arch_shrine_keeper",
    role: "healer",
    faction: "pilgrims",
    temperament: "calm",
    motivePool: ["protect_chapel", "preserve_rituals", "prevent_panic"],
    secretPool: [
      "performs_forbidden_rites",
      "shelters_marked_refugees",
      "guards_hidden_relic",
    ],
    dialogueStyle: "reserved",
  },
  {
    id: "npc_arch_scavenger_guide",
    role: "villager",
    faction: "scavengers",
    temperament: "opportunistic",
    motivePool: ["sell_safe_routes", "stay_indispensable", "collect_favors"],
    secretPool: [
      "mapped_smuggler_tide_windows",
      "betrayed_previous_client",
      "knows_watchtower_collapse_cause",
    ],
    dialogueStyle: "friendly",
  },
];
