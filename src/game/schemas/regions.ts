import type { Faction, ID, Mood } from "../../lib/types/common";

export type RegionTemplate = {
  id: ID;
  name: string;
  mood: Mood;
  biome: string;
  startingLocationId: ID;
  allowedLocationIds: ID[];
  dominantFactions: Faction[];
  narrativeSummary: string;
};
