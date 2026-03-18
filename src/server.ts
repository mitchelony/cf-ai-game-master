import { routeAgentRequest } from "agents";

export { GameMasterAgent } from "./agent/GameMasterAgent";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    void ctx;

    const agentResponse = await routeAgentRequest(request, env);

    if (agentResponse) {
      return agentResponse;
    }

    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
