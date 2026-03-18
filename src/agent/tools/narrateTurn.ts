import type { ResolutionResult } from "../../game/engine/turn/resolveAction";
import type { Action } from "../../game/schemas/actions";
import type { SessionState } from "../../game/schemas/session";
import { buildNarrateTurnPrompt } from "../prompts/narrateTurn";

const NARRATION_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

type AiTextResponse = {
  response?: string;
};

function dedupeSentences(text: string): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [];
  const unique: string[] = [];
  let previousNormalized = "";

  for (const sentence of sentences) {
    const normalized = sentence.replace(/\s+/g, " ").trim().toLowerCase();

    if (!normalized || normalized === previousNormalized) {
      continue;
    }

    previousNormalized = normalized;
    unique.push(sentence.replace(/\s+/g, " ").trim());

    if (unique.length === 3) {
      break;
    }
  }

  return unique.join(" ").trim();
}

function sanitizeNarrationOutput(text: string): string {
  const cleaned = text
    .replace(/\s+/g, " ")
    .replace(/\s*->\s*.*/g, "")
    .replace(/\bWait,?\s+no,.*$/i, "")
    .replace(/\bHere is the.*$/i, "")
    .replace(/\bI made a mistake.*$/i, "")
    .trim();

  const lastSentenceBoundary = Math.max(
    cleaned.lastIndexOf("."),
    cleaned.lastIndexOf("!"),
    cleaned.lastIndexOf("?"),
  );

  if (lastSentenceBoundary === -1) {
    return "";
  }

  return dedupeSentences(cleaned.slice(0, lastSentenceBoundary + 1).trim());
}

export async function narrateTurn(
  env: Env,
  session: SessionState,
  action: Action,
  resolution: ResolutionResult,
): Promise<string> {
  const prompt = buildNarrateTurnPrompt({
    session,
    action,
    resolution,
  });

  const result = (await env.AI.run(NARRATION_MODEL, {
    prompt,
    max_tokens: 120,
    temperature: 0.35,
    top_p: 0.85,
  })) as AiTextResponse | string;

  if (typeof result === "string") {
    const sanitized = sanitizeNarrationOutput(result);
    if (sanitized) {
      return sanitized;
    }
    throw new Error("Workers AI returned incomplete narration text.");
  }

  if (result?.response) {
    const sanitized = sanitizeNarrationOutput(result.response);
    if (sanitized) {
      return sanitized;
    }
    throw new Error("Workers AI returned incomplete narration text.");
  }

  throw new Error("Workers AI returned an unexpected narration payload.");
}
