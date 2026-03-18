import type { SessionState } from "../../game/schemas/session";

export function buildGenerateIntroPrompt(session: SessionState): string {
  const currentLocation = session.world.locations[session.player.locationId];

  return `
You are writing the opening narration for a text adventure.

Rules:
- 3 to 5 sentences.
- Introduce the setting and immediate tension.
- Stay grounded in the provided world state.
- Do not invent new mechanics or state.

Player:
- Name: ${session.player.name}
- Archetype: ${session.player.archetype}

Region:
- ${session.world.currentRegionId}

Starting location:
- ${currentLocation?.name ?? "Unknown"}

Location danger:
- ${currentLocation?.dangerRating ?? "unknown"}

Write the opening narration now.
  `.trim();
}
