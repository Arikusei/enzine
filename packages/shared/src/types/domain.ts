import type { SeasonStatus } from "../enums/season-status.js";
import type { PhaseStatus } from "../enums/phase-status.js";
import type { NodeType } from "../enums/node-type.js";
import type { UserState } from "../enums/user-state.js";
import type { ActionType } from "../enums/action-type.js";
import type { ProviderType } from "../enums/provider-type.js";

export interface Season {
  id: string;
  slug: string;
  title: string;
  description?: string;
  status: SeasonStatus;
  startsAt?: string;
  endsAt?: string;
}

export interface Phase {
  id: string;
  seasonId: string;
  orderIndex: number;
  slug: string;
  title: string;
  description?: string;
  status: PhaseStatus;
}

export interface Node {
  id: string;
  phaseId: string;
  type: NodeType;
  title: string;
  body?: string;
  payloadJson?: Record<string, unknown>;
  orderIndex: number;
  isActive: boolean;
}

export interface UserStateRecord {
  id: string;
  userId: string;
  seasonId: string;
  currentPhaseId?: string;
  state: UserState;
  updatedAt: string;
}

export interface ActionLogEntry {
  userId?: string;
  seasonId?: string;
  actionType: ActionType;
  objectType?: string;
  objectId?: string;
  payloadJson?: Record<string, unknown>;
}

export interface IdentityRecord {
  userId: string;
  provider: ProviderType;
  providerUserId: string;
  username?: string;
  rawProfileJson?: Record<string, unknown>;
}
