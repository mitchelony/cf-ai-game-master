import type { ID } from "../../lib/types/common";

export type LocationType =
  | "town"
  | "wilderness"
  | "dungeon"
  | "landmark"
  | "interior"
  | "road"
  | "custom";

export type LocationTemplate = {
  id: ID;
  name: string;
  regionId: ID;
  type: LocationType;
  connectedLocationIds: ID[];
  dangerRating: number;
  possibleEncounterIds: ID[];
  defaultItemIds: ID[];
  defaultNpcIds: ID[];
};

export type LocationState = {
  id: ID;
  name: string;
  regionId: ID;
  type: LocationType;
  connectedLocationIds: ID[];
  dangerRating: number;
  visibleNpcIds: ID[];
  availableItemIds: ID[];
  discovered: boolean;
};

export type Location = LocationState;
