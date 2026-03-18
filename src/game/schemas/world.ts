import type { Faction, ID } from "../../lib/types/common";
import type { LocationState } from "./location";

export type WorldVariableValue = string | number | boolean;

export type RegionState = {
  regionId: ID;
  threatLevel: number;
  stability: number;
  controllingFaction?: Faction;
  flags: Record<string, boolean>;
};

export type EncounterState = {
  id: ID;
  type: string;
  locationId: ID;
  participantIds: ID[];
  isResolved: boolean;
  flags: Record<string, boolean>;
};

export type WorldState = {
  currentRegionId: ID;
  worldVariables: Record<string, WorldVariableValue>;
  regionState: Record<ID, RegionState>;
  locations: Record<ID, LocationState>;
  discoveredLocationIds: ID[];
  activeEncounters: EncounterState[];
  worldFlags: Record<string, boolean>;
};

export type World = WorldState;
