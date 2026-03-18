import type { SessionState } from "../../game/schemas/session";

export function buildSummarizeSessionPrompt(session: SessionState): string {
  const recentEvents = session.eventLog.slice(-8).map((event) => {
    return `[Turn ${event.turn}] ${event.type}: ${event.message}`;
  });

  return `
Summarize this game session in one short paragraph.

Rules:
- Focus on what the player did and what changed.
- Keep it under 120 words.
- Do not invent events.

Recent events:
${recentEvents.join("\n")}
  `.trim();
}
