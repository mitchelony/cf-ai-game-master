import type { ID } from "../../lib/types/common";

export type MoveAction = {
  type: "move";
  destinationId: ID;
};

export type InspectAction = {
  type: "inspect";
  target?: string;
};

export type TalkAction = {
  type: "talk";
  targetNpcId: ID;
  topic?: string;
};

export type TakeAction = {
  type: "take";
  itemId: ID;
};

export type UseAction = {
  type: "use";
  itemId: ID;
  targetId?: ID;
};

export type AttackAction = {
  type: "attack";
  targetId: ID;
};

export type RestAction = {
  type: "rest";
};

export type MetaCommand = "help" | "recap" | "status";

export type MetaAction = {
  type: "meta";
  command: MetaCommand;
};

export type Action =
  | MoveAction
  | InspectAction
  | TalkAction
  | TakeAction
  | UseAction
  | AttackAction
  | RestAction
  | MetaAction;

export type ActionType = Action["type"];
