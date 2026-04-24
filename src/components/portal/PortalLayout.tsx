import { ReactNode } from "react";
import { PortalHeader } from "./PortalHeader";
import { PortalFooter } from "./PortalFooter";
import "@/styles/portal.css";

interface Props {
  children: ReactNode;
  headerVariant?: "transparent" | "solid";
}

export function PortalLayout({ children, headerVariant = "transparent" }: Props) {
  return (
    <div className="portal-theme flex flex-col min-h-screen">
      <PortalHeader variant={headerVariant} />
      <main className="flex-1">{children}</main>
      <PortalFooter />
    </div>
  );
}
