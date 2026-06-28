import {
  ActionType,
  ProviderType,
  UserState,
  type ActionLogEntry,
  type IdentityRecord,
} from "@enzine/shared";

export function createTelegramIdentity(
  telegramId: number,
  username?: string,
  profile?: Record<string, unknown>,
): Omit<IdentityRecord, "userId"> & { userId?: string } {
  return {
    provider: ProviderType.Telegram,
    providerUserId: String(telegramId),
    username,
    rawProfileJson: profile,
  };
}

export function resolveStateAfterStart(current: UserState): UserState {
  if (current === UserState.NewUser) {
    return UserState.SeasonOpened;
  }
  return UserState.SeasonOpened;
}

export function buildStartActionLogs(seasonId?: string): ActionLogEntry[] {
  return [
    { actionType: ActionType.UserCreated },
    { actionType: ActionType.IdentityLinked },
    { actionType: ActionType.SeasonOpened, seasonId },
  ];
}

export function logAction(entry: ActionLogEntry): void {
  console.log("[action]", entry.actionType, entry);
}
