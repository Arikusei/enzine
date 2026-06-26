import type { User } from "../types/user.js";

export function formatUserName(user: Pick<User, "firstName" | "lastName" | "username">): string {
  if (user.firstName) {
    return [user.firstName, user.lastName].filter(Boolean).join(" ");
  }
  return user.username ?? "друг";
}
