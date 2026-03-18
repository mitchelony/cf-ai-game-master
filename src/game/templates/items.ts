import type { ItemTemplate } from "../schemas/items";

export const ITEM_TEMPLATES: ItemTemplate[] = [
  {
    id: "item_salt_worn_dagger",
    name: "Salt-Worn Dagger",
    description: "A pitted dagger that still keeps a sharp edge.",
    rarity: "common",
    tags: ["weapon", "light"],
  },
  {
    id: "item_chapel_key",
    name: "Chapel Key",
    description: "An old iron key marked with a tide sigil.",
    rarity: "uncommon",
    tags: ["key", "quest"],
  },
  {
    id: "item_ration_pack",
    name: "Ration Pack",
    description: "Dry fish and hard bread wrapped in waxed cloth.",
    rarity: "common",
    tags: ["consumable", "survival"],
  },
  {
    id: "item_contraband_ledger",
    name: "Contraband Ledger",
    description: "A coded ledger listing hidden shipments and buyers.",
    rarity: "rare",
    tags: ["quest", "evidence"],
  },
  {
    id: "item_rusted_charm",
    name: "Rusted Charm",
    description: "A palm-sized charm said to ward off deep-water spirits.",
    rarity: "common",
    tags: ["trinket", "trade"],
  },
  {
    id: "item_healing_tonic",
    name: "Healing Tonic",
    description: "A bitter tonic that quickly closes minor wounds.",
    rarity: "uncommon",
    tags: ["consumable", "healing"],
  },
  {
    id: "item_smuggler_map_scrap",
    name: "Smuggler Map Scrap",
    description: "Half a tunnel map annotated with tide timings.",
    rarity: "uncommon",
    tags: ["quest", "map"],
  },
  {
    id: "item_signal_flare",
    name: "Signal Flare",
    description: "A red flare that burns bright even in sea mist.",
    rarity: "common",
    tags: ["tool", "utility"],
  },
];
