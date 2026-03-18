import type { ID } from "../../../lib/types/common";
import type { EncounterTemplate } from "../../schemas/encounters";
import type { ItemTemplate } from "../../schemas/items";
import type { LocationTemplate } from "../../schemas/location";
import type { NpcTemplate } from "../../schemas/npc";
import type { QuestTemplate } from "../../schemas/quests";
import type { RegionTemplate } from "../../schemas/regions";
import { ENCOUNTER_TEMPLATES } from "../../templates/encounters";
import { ITEM_TEMPLATES } from "../../templates/items";
import { LOCATION_TEMPLATES } from "../../templates/locations";
import { NPC_TEMPLATES } from "../../templates/npcs";
import { QUEST_TEMPLATES } from "../../templates/quests";
import { REGION_TEMPLATES } from "../../templates/regions";

function requireEntity<T>(value: T | undefined, label: string, id?: ID): T {
  if (!value) {
    throw new Error(
      id ? `${label} not found for id: ${id}` : `${label} not found`,
    );
  }
  return value;
}

export function getDefaultRegionTemplate(): RegionTemplate {
  return requireEntity(REGION_TEMPLATES[0], "Default region template");
}

export function getRegionTemplateById(regionId: ID): RegionTemplate {
  return requireEntity(
    REGION_TEMPLATES.find((region) => region.id === regionId),
    "Region template",
    regionId,
  );
}

export function getRegionTemplateOrDefault(regionId?: ID): RegionTemplate {
  return regionId ? getRegionTemplateById(regionId) : getDefaultRegionTemplate();
}

export function getLocationTemplateById(locationId: ID): LocationTemplate {
  return requireEntity(
    LOCATION_TEMPLATES.find((location) => location.id === locationId),
    "Location template",
    locationId,
  );
}

export function getLocationTemplatesForRegion(regionId: ID): LocationTemplate[] {
  return LOCATION_TEMPLATES.filter((location) => location.regionId === regionId);
}

export function getNpcTemplateById(npcTemplateId: ID): NpcTemplate {
  return requireEntity(
    NPC_TEMPLATES.find((npc) => npc.id === npcTemplateId),
    "NPC template",
    npcTemplateId,
  );
}

export function getQuestTemplateById(questTemplateId: ID): QuestTemplate {
  return requireEntity(
    QUEST_TEMPLATES.find((quest) => quest.id === questTemplateId),
    "Quest template",
    questTemplateId,
  );
}

export function getItemTemplateById(itemId: ID): ItemTemplate {
  return requireEntity(
    ITEM_TEMPLATES.find((item) => item.id === itemId),
    "Item template",
    itemId,
  );
}

export function getEncounterTemplateById(
  encounterId: ID,
): EncounterTemplate {
  return requireEntity(
    ENCOUNTER_TEMPLATES.find((encounter) => encounter.id === encounterId),
    "Encounter template",
    encounterId,
  );
}
