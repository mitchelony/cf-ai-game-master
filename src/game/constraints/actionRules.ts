import type { ActionType, MetaCommand } from "../schemas/actions";

export const ACTION_TYPES: readonly ActionType[] = [
  "move",
  "inspect",
  "talk",
  "take",
  "use",
  "attack",
  "rest",
  "meta",
] as const;

export type ActionValidationMeta = {
  minArgs: number;
  maxArgs: number;
  requiresTarget: boolean;
  description: string;
};

export const ACTION_RULES: Record<ActionType, ActionValidationMeta> = {
  move: {
    minArgs: 1,
    maxArgs: 2,
    requiresTarget: true,
    description: "Move to a location, direction, or named destination.",
  },
  inspect: {
    minArgs: 0,
    maxArgs: 2,
    requiresTarget: false,
    description: "Inspect surroundings or a specific object/NPC.",
  },
  talk: {
    minArgs: 1,
    maxArgs: 2,
    requiresTarget: true,
    description: "Start dialogue with an NPC target.",
  },
  take: {
    minArgs: 1,
    maxArgs: 2,
    requiresTarget: true,
    description: "Pick up an item from the current location.",
  },
  use: {
    minArgs: 1,
    maxArgs: 3,
    requiresTarget: true,
    description: "Use an item, optionally with a target.",
  },
  attack: {
    minArgs: 1,
    maxArgs: 2,
    requiresTarget: true,
    description: "Attack a hostile or targetable entity.",
  },
  rest: {
    minArgs: 0,
    maxArgs: 1,
    requiresTarget: false,
    description: "Spend time to recover resources if resting is allowed.",
  },
  meta: {
    minArgs: 0,
    maxArgs: 2,
    requiresTarget: false,
    description: "Run a non-world command like help, recap, or status.",
  },
};

export const META_COMMANDS: readonly MetaCommand[] = [
  "help",
  "recap",
  "status",
] as const;

export function isActionType(value: string): value is ActionType {
  return (ACTION_TYPES as readonly string[]).includes(value);
}
