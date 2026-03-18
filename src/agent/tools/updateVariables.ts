import type { SessionState } from "../../game/schemas/session";
import type { WorldState } from "../../game/schemas/world";

export function updateVariables(
  session: SessionState,
  updates: Partial<WorldState["worldVariables"]>,
): SessionState {
  const nextWorldVariables = { ...session.world.worldVariables };

  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      nextWorldVariables[key] = value;
    }
  }

  return {
    ...session,
    world: {
      ...session.world,
      worldVariables: nextWorldVariables,
    },
  };
}
