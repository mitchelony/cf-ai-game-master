import type { ID, Rarity } from "../../lib/types/common";

export type ItemTemplate = {
  id: ID;
  name: string;
  description: string;
  rarity: Rarity;
  tags: string[];
};
