import type { RegionTemplate } from "../schemas/regions";

export const REGION_TEMPLATES: RegionTemplate[] = [
  {
    id: "region_shattered_coast",
    name: "The Shattered Coast",
    mood: "tense",
    biome: "storm-battered coastline",
    startingLocationId: "loc_ruined_harbor",
    allowedLocationIds: [
      "loc_ruined_harbor",
      "loc_salt_chapel",
      "loc_collapsed_watchtower",
      "loc_smuggler_tunnel",
      "loc_black_tide_market",
    ],
    dominantFactions: ["wardens", "scavengers", "pilgrims"],
    narrativeSummary:
      "A broken coastline where smugglers, pilgrims, and patrols fight for control while old rites return with the tide.",
  },
];
