import type { ReactNode } from "react";

interface MiniAppShellProps {
  children: ReactNode;
}

export function MiniAppShell({ children }: MiniAppShellProps) {
  return (
    <div className="shell">
      <div className="shell__inner">{children}</div>
    </div>
  );
}
