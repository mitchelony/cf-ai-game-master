import type { ID } from "../../lib/types/common";

export type EncounterTemplate = {
  id: ID;
  name: string;
  description: string;
  dangerRating: number;
  possibleOutcomes: ID[];
};
