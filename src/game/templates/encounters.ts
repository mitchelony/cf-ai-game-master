import type { EncounterTemplate } from "../schemas/encounters";

export const ENCOUNTER_TEMPLATES: EncounterTemplate[] = [
  {
    id: "enc_ambush_narrow_passage",
    name: "Ambush in Narrow Passage",
    description: "Raiders strike from broken walls where movement is limited.",
    dangerRating: 3,
    possibleOutcomes: ["fight_off_raiders", "pay_toll", "retreat"],
  },
  {
    id: "enc_trapped_cache",
    name: "Trapped Cache",
    description: "A supply cache rigged with a crude tripline mechanism.",
    dangerRating: 2,
    possibleOutcomes: ["disarm_and_loot", "trigger_trap", "leave_it"],
  },
  {
    id: "enc_rumor_exchange",
    name: "Rumor Exchange",
    description: "Travelers trade rumors for coin, favors, or information.",
    dangerRating: 1,
    possibleOutcomes: ["gain_lead", "lose_reputation", "learn_faction_shift"],
  },
  {
    id: "enc_wounded_traveler",
    name: "Wounded Traveler",
    description: "A wounded courier begs for aid before a patrol arrives.",
    dangerRating: 2,
    possibleOutcomes: ["provide_aid", "extract_info", "ignore_and_move_on"],
  },
  {
    id: "enc_faction_patrol_stop",
    name: "Faction Patrol Stop",
    description: "Armed patrol inspects goods and asks hard questions.",
    dangerRating: 3,
    possibleOutcomes: ["pass_inspection", "bribe_patrol", "detained"],
  },
];
