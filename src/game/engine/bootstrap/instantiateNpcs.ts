import type { ID } from "../../../lib/types/common";
import type { LocationState } from "../../schemas/location";
import type { NpcState, NpcTemplate } from "../../schemas/npc";
import {
  getLocationTemplatesForRegion,
  getNpcTemplateById,
} from "../utils/selectors";
import { createId } from "../utils/ids";

export type InstantiatedNpcs = {
  npcs: Record<ID, NpcState>;
  locations: Record<ID, LocationState>;
};

const NPC_NAME_BANK: Record<string, string[]> = {
  npc_arch_suspicious_merchant: ["Marek", "Selka", "Tovin"],
  npc_arch_exiled_warden: ["Seren", "Bram", "Ilya"],
  npc_arch_shrine_keeper: ["Mother Vael", "Sister Nima", "Edda"],
  npc_arch_scavenger_guide: ["Rook", "Fen", "Cass"],
};

function getNameForTemplate(template: NpcTemplate, index: number): string {
  const names = NPC_NAME_BANK[template.id];
  if (names && names.length > 0) {
    return names[index % names.length];
  }

  return `Wanderer ${index + 1}`;
}

function getStartingTrust(template: NpcTemplate): number {
  switch (template.faction) {
    case "pilgrims":
      return 15;
    case "wardens":
      return 5;
    case "scavengers":
      return 0;
    default:
      return 0;
  }
}

function getStartingSuspicion(template: NpcTemplate): number {
  switch (template.temperament) {
    case "guarded":
      return 35;
    case "stern":
      return 30;
    case "opportunistic":
      return 25;
    case "calm":
      return 10;
    default:
      return 20;
  }
}

function pickKnownSecrets(template: NpcTemplate): string[] {
  return template.secretPool.slice(0, 1);
}

export function instantiateNpcs(
  regionId: ID,
  locations: Record<ID, LocationState>,
): InstantiatedNpcs {
  const regionLocationTemplates = getLocationTemplatesForRegion(regionId);
  const nextLocations: Record<ID, LocationState> = Object.fromEntries(
    Object.entries(locations).map(([id, location]) => [
      id,
      {
        ...location,
        visibleNpcIds: [...location.visibleNpcIds],
      },
    ]),
  );

  const npcs: Record<ID, NpcState> = {};
  const templateInstanceCounts: Record<ID, number> = {};

  for (const locationTemplate of regionLocationTemplates) {
    for (const npcTemplateId of locationTemplate.defaultNpcIds) {
      const template = getNpcTemplateById(npcTemplateId);
      const currentCount = templateInstanceCounts[template.id] ?? 0;
      templateInstanceCounts[template.id] = currentCount + 1;

      const npcId = createId(template.id.replace("npc_arch_", "npc"));
      const npcName = getNameForTemplate(template, currentCount);

      const npcState: NpcState = {
        id: npcId,
        archetypeId: template.id,
        name: npcName,
        role: template.role,
        faction: template.faction,
        trust: getStartingTrust(template),
        suspicion: getStartingSuspicion(template),
        currentLocationId: locationTemplate.id,
        isAlive: true,
        knownSecrets: pickKnownSecrets(template),
        dialogueStyle: template.dialogueStyle,
      };

      npcs[npcId] = npcState;
      nextLocations[locationTemplate.id].visibleNpcIds.push(npcId);
    }
  }

  return {
    npcs,
    locations: nextLocations,
  };
}
