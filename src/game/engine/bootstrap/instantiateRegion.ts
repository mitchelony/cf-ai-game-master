import type { ID } from "../../../lib/types/common";
import { VARIABLE_BOUNDS } from "../../constraints/variableBounds";
import type { LocationState } from "../../schemas/location";
import type { RegionTemplate } from "../../schemas/regions";
import type { RegionState, WorldState } from "../../schemas/world";
import {
  getLocationTemplatesForRegion,
  getRegionTemplateOrDefault,
} from "../utils/selectors";

export type InstantiatedRegion = {
  regionTemplate: RegionTemplate;
  startingLocationId: ID;
  world: WorldState;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function buildLocationState(
  template: {
    id: ID;
    name: string;
    regionId: ID;
    type: LocationState["type"];
    connectedLocationIds: ID[];
    dangerRating: number;
    defaultItemIds: ID[];
  },
  discovered = false,
): LocationState {
  return {
    id: template.id,
    name: template.name,
    regionId: template.regionId,
    type: template.type,
    connectedLocationIds: [...template.connectedLocationIds],
    dangerRating: template.dangerRating,
    visibleNpcIds: [],
    availableItemIds: [...template.defaultItemIds],
    discovered,
  };
}

function buildDefaultWorldVariables(): WorldState["worldVariables"] {
  return {
    dangerLevel: VARIABLE_BOUNDS.dangerLevel.default,
    corruption: VARIABLE_BOUNDS.corruption.default,
    factionTension: VARIABLE_BOUNDS.factionTension.default,
    publicOrder: VARIABLE_BOUNDS.publicOrder.default,
    scarcity: VARIABLE_BOUNDS.scarcity.default,
  };
}

function buildRegionState(regionTemplate: RegionTemplate, averageDanger: number): RegionState {
  const threatLevel = clamp(Math.round(averageDanger * 20), 0, 100);
  const stability = clamp(100 - threatLevel, 0, 100);

  return {
    regionId: regionTemplate.id,
    threatLevel,
    stability,
    controllingFaction: regionTemplate.dominantFactions[0],
    flags: {
      initialized: true,
      unrest: threatLevel >= 60,
      secretsAwakened: false,
    },
  };
}

export function instantiateRegion(regionId?: ID): InstantiatedRegion {
  const regionTemplate = getRegionTemplateOrDefault(regionId);
  const locationTemplates = getLocationTemplatesForRegion(regionTemplate.id);

  if (locationTemplates.length === 0) {
    throw new Error(
      `No location templates found for region: ${regionTemplate.id}`,
    );
  }

  const locations = Object.fromEntries(
    locationTemplates.map((template) => [
      template.id,
      buildLocationState(
        template,
        template.id === regionTemplate.startingLocationId,
      ),
    ]),
  ) as Record<ID, LocationState>;

  const averageDanger =
    locationTemplates.reduce(
      (sum, location) => sum + location.dangerRating,
      0,
    ) / locationTemplates.length;

  const world: WorldState = {
    currentRegionId: regionTemplate.id,
    worldVariables: buildDefaultWorldVariables(),
    regionState: {
      [regionTemplate.id]: buildRegionState(regionTemplate, averageDanger),
    },
    locations,
    discoveredLocationIds: [regionTemplate.startingLocationId],
    activeEncounters: [],
    worldFlags: {
      introGenerated: false,
      firstMoveTaken: false,
      regionInitialized: true,
    },
  };

  return {
    regionTemplate,
    startingLocationId: regionTemplate.startingLocationId,
    world,
  };
}
