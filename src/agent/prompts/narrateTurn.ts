import type { ResolutionResult } from "../../game/engine/turn/resolveAction";
import type { Action } from "../../game/schemas/actions";
import type { SessionState } from "../../game/schemas/session";

type NarrationPromptInput = {
  session: SessionState;
  action: Action;
  resolution: ResolutionResult;
};

export function buildNarrateTurnPrompt({
  session,
  action,
  resolution,
}: NarrationPromptInput): string {
  const currentLocation = session.world.locations[session.player.locationId];

  const locationName = currentLocation?.name ?? "Unknown Location";
  const visibleNpcNames = currentLocation
    ? currentLocation.visibleNpcIds
        .map((npcId) => session.npcs[npcId]?.name)
        .filter(Boolean)
        .join(", ")
    : "";

  return `
You are narrating a text adventure game turn.

Rules:
- Keep the narration grounded in the game state.
- Do not invent state changes.
- Do not contradict the provided deterministic result.
- Stay very close to the deterministic outcome summary.
- Write exactly 2 or 3 sentences.
- Keep it vivid but concise.
- Prefer concrete sensory detail over abstract mood.
- Mention only details that are directly supported by the game state or outcome.
- Avoid filler, moral reflection, foreshadowing, or vague possibility language.
- Avoid generic fantasy phrases like "the air seems to hum" or "possibilities unfold."
- Do not add new dialogue unless the deterministic result already implies it.
- For talk actions, focus on the immediate exchange and tone, not a long conversation arc.
- For move actions, focus on the transition and arrival.
- For inspect actions, focus on what stands out in the scene right now.
- Never comment on your own writing.
- Never mention sentence counts, formatting rules, or corrections.
- Never output notes, drafts, revisions, or explanations.
- Do not use arrows, labels, or prefatory text.
- Do not mention game engines, variables, or internal logic.
- End naturally, not with a list.

Player:
- Name: ${session.player.name}
- Archetype: ${session.player.archetype}

Current location:
- Name: ${locationName}
- Danger rating: ${currentLocation?.dangerRating ?? "unknown"}

Visible NPCs:
- ${visibleNpcNames || "None"}

Action:
${JSON.stringify(action, null, 2)}

Deterministic outcome summary:
${resolution.summary}

Additional details:
${JSON.stringify(resolution.details ?? {}, null, 2)}

Output only the final narrative text.
  `.trim();
}
