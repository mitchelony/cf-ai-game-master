export type WorldRules = {
  maxInventorySize: number;
  maxActiveQuests: number;
  maxPartySize: number;
  allowRestInHostileZones: boolean;
};

export const WORLD_RULES: WorldRules = {
  maxInventorySize: 20,
  maxActiveQuests: 5,
  maxPartySize: 1,
  allowRestInHostileZones: false,
};

export function canRestInZone(isHostileZone: boolean): boolean {
  if (!isHostileZone) return true;
  return WORLD_RULES.allowRestInHostileZones;
}
